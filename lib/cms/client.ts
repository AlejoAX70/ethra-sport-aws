export class CmsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = "CmsApiError";
  }
}

function getCmsConfig() {
  if (typeof window !== "undefined") {
    return { baseUrl: "/api/cms", tenantKey: undefined };
  }

  const storefrontBase = process.env.STOREFRONT_API_URL?.trim().replace(/\/$/, "");
  const tenantKey = process.env.TENANT_API_KEY?.trim();

  if (!storefrontBase) {
    throw new Error("Falta STOREFRONT_API_URL para CMS.");
  }
  if (!tenantKey) {
    throw new Error("Falta TENANT_API_KEY para CMS.");
  }

  return { baseUrl: `${storefrontBase}/cms`, tenantKey };
}

function resolveUrl(path: string): string {
  const { baseUrl } = getCmsConfig();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalized}`;
}

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { tenantKey } = getCmsConfig();
  const url = resolveUrl(path);
  const headers = new Headers(init?.headers);
  if (tenantKey) headers.set("X-Tenant-Key", tenantKey);

  const response = await fetch(url, { ...init, headers, cache: "no-store" });

  if (!response.ok) {
    const text = await response.text();
    let message = response.statusText;
    try {
      const data = JSON.parse(text);
      if (data?.message) message = data.message;
      throw new CmsApiError(message, response.status, data);
    } catch (e) {
      if (e instanceof CmsApiError) throw e;
      throw new CmsApiError(message, response.status, text);
    }
  }

  return response.json() as Promise<T>;
}
