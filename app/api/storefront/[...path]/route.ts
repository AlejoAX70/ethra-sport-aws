import { NextRequest, NextResponse } from "next/server";
import * as http from "node:http";
import * as https from "node:https";

export const runtime = "nodejs";

const TENANT_KEY_HEADER = "X-Tenant-Key";
// Cabeceras que no deben reenviarse tal cual (hop-by-hop / recalculadas por Next.js).
const STRIP_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "connection",
  "transfer-encoding",
  "keep-alive",
]);

function getStorefrontEnv() {
  const baseUrl = process.env.STOREFRONT_API_URL?.trim().replace(/\/$/, "");
  const tenantKey = process.env.TENANT_API_KEY?.trim();

  if (!baseUrl || !tenantKey) {
    throw new Error("Missing STOREFRONT_API_URL or TENANT_API_KEY");
  }

  return { baseUrl, tenantKey };
}

interface ProxyResult {
  status: number;
  statusText: string;
  headers: Record<string, string | string[]>;
  body: Buffer;
}

/**
 * Reenvía la petición usando node:http(s) en lugar del fetch() global de Next.js.
 *
 * Por qué: en runtime serverless de producción (Amplify), el fetch() parcheado de
 * Next.js 15 ha perdido cabeceras salientes bajo reuso de conexión — ya se vio con
 * el body de POST (ver commits dd33643/8adcc6e) y volvió a aparecer aquí para GET:
 * el backend respondía "X-Tenant-Key es requerido" pese a que el código sí la
 * seteaba. Reproducido de forma aislada (Node puro, mismo backend) la cabecera SÍ
 * llega — o sea que el bug está en la capa fetch/undici de Next, no en la lógica.
 * node:https no pasa por esa capa, así que evita la clase de bug por completo.
 */
function forwardRequest(
  targetUrl: string,
  { method, headers, body }: { method: string; headers: Record<string, string>; body?: Buffer },
): Promise<ProxyResult> {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const transport = url.protocol === "http:" ? http : https;

    const req = transport.request(
      url,
      {
        method,
        headers: {
          ...headers,
          ...(body ? { "Content-Length": String(body.byteLength) } : {}),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 502,
            statusText: res.statusMessage ?? "",
            headers: res.headers as Record<string, string | string[]>,
            body: Buffer.concat(chunks),
          });
        });
      },
    );

    req.on("error", reject);
    if (body && body.byteLength > 0) req.write(body);
    req.end();
  });
}

async function proxyStorefrontRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { baseUrl, tenantKey } = getStorefrontEnv();
    const resolvedParams = await params;
    const splat = resolvedParams.path ? `/${resolvedParams.path.join("/")}` : "";
    const incomingUrl = new URL(request.url);
    const storefrontUrl = `${baseUrl}${splat}${incomingUrl.search}`;
    const method = request.method.toUpperCase();

    const outHeaders: Record<string, string> = {
      Accept: "application/json",
      [TENANT_KEY_HEADER]: tenantKey,
    };

    const originalContentType = request.headers.get("Content-Type");
    if (originalContentType && method !== "GET" && method !== "HEAD") {
      outHeaders["Content-Type"] = originalContentType;
    }

    let body: Buffer | undefined;
    if (method !== "GET" && method !== "HEAD") {
      const bodyBytes = await request.arrayBuffer();
      if (bodyBytes.byteLength > 0) body = Buffer.from(bodyBytes);
    }

    let result = await forwardRequest(storefrontUrl, { method, headers: outHeaders, body });

    // Redirect manual (API Gateway a veces normaliza rutas) — reenviar preservando método/headers/body.
    if (result.status >= 300 && result.status < 400) {
      const location = result.headers.location;
      const locationUrl = Array.isArray(location) ? location[0] : location;
      if (locationUrl) {
        result = await forwardRequest(locationUrl, { method, headers: outHeaders, body });
      }
    }

    const responseHeaders = new Headers();
    for (const [key, value] of Object.entries(result.headers)) {
      if (STRIP_RESPONSE_HEADERS.has(key.toLowerCase())) continue;
      if (Array.isArray(value)) {
        for (const v of value) responseHeaders.append(key, v);
      } else if (value) {
        responseHeaders.set(key, value);
      }
    }

    return new NextResponse(new Uint8Array(result.body), {
      status: result.status,
      statusText: result.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[storefront proxy] request failed:", error);
    const message =
      error instanceof Error && error.message.includes("TENANT_API_KEY")
        ? "TENANT_API_KEY no disponible en el servidor. Revisa .env.local (local) o Amplify Environment variables + amplify.yml."
        : "Storefront proxy failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export const GET = proxyStorefrontRequest;
export const POST = proxyStorefrontRequest;
export const PUT = proxyStorefrontRequest;
export const PATCH = proxyStorefrontRequest;
export const DELETE = proxyStorefrontRequest;
