import { NextRequest, NextResponse } from "next/server";

const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

function getStorefrontEnv() {
  const baseUrl = process.env.STOREFRONT_API_URL?.replace(/\/$/, "");
  const tenantKey = process.env.TENANT_API_KEY;

  if (!baseUrl || !tenantKey) {
    throw new Error("Missing STOREFRONT_API_URL or TENANT_API_KEY");
  }

  return { baseUrl, tenantKey };
}

function createProxyHeaders(request: NextRequest, tenantKey: string) {
  const headers = new Headers(request.headers);

  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }

  headers.set("X-Tenant-Key", tenantKey);
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
    const init: RequestInit & { duplex?: "half" } = {
      method,
      headers: createProxyHeaders(request, tenantKey),
    };

    if (method !== "GET" && method !== "HEAD") {
      init.body = request.body;
      init.duplex = "half";
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
    return NextResponse.json(
      { message: "Storefront proxy failed" },
      { status: 500 },
    );
  }
}

export const GET = proxyStorefrontRequest;
export const POST = proxyStorefrontRequest;
export const PUT = proxyStorefrontRequest;
export const PATCH = proxyStorefrontRequest;
export const DELETE = proxyStorefrontRequest;
