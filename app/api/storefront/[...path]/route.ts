import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TENANT_KEY_HEADER = "X-Tenant-Key";

function getStorefrontEnv() {
  const baseUrl = process.env.STOREFRONT_API_URL?.trim().replace(/\/$/, "");
  const tenantKey = process.env.TENANT_API_KEY?.trim();

  if (!baseUrl || !tenantKey) {
    throw new Error("Missing STOREFRONT_API_URL or TENANT_API_KEY");
  }

  return { baseUrl, tenantKey };
}

function createProxyHeaders(tenantKey: string) {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set(TENANT_KEY_HEADER, tenantKey);
  return headers;
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

    const headers = createProxyHeaders(tenantKey);

    const originalContentType = request.headers.get("Content-Type");
    if (originalContentType && method !== "GET" && method !== "HEAD") {
      headers.set("Content-Type", originalContentType);
    }

    if (!headers.get(TENANT_KEY_HEADER)) {
      return NextResponse.json(
        { message: `${TENANT_KEY_HEADER} no configurado en el proxy` },
        { status: 500 },
      );
    }

    const init: RequestInit = { method, headers };

    if (method !== "GET" && method !== "HEAD") {
      const bodyBytes = await request.arrayBuffer();
      if (bodyBytes.byteLength > 0) {
        init.body = bodyBytes;
      }
    }

    const response = await fetch(storefrontUrl, init);
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
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
