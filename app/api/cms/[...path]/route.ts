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

async function proxyCmsRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { baseUrl, tenantKey } = getStorefrontEnv();
    const resolvedParams = await params;
    const splat = resolvedParams.path ? `/${resolvedParams.path.join("/")}` : "";
    const incomingUrl = new URL(request.url);
    const cmsUrl = `${baseUrl}/cms${splat}${incomingUrl.search}`;

    const headers = new Headers();
    headers.set("Accept", "application/json");
    headers.set(TENANT_KEY_HEADER, tenantKey);

    const response = await fetch(cmsUrl, { method: request.method, headers, cache: "no-store" });
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ message: "CMS proxy failed" }, { status: 500 });
  }
}

export const GET = proxyCmsRequest;
