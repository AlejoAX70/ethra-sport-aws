export class StorefrontApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = "StorefrontApiError";
  }
}

function getStorefrontConfig() {
  if (typeof window !== "undefined") {
    return { baseUrl: "/api/storefront", tenantKey: undefined };
  }

  const baseUrl = process.env.STOREFRONT_API_URL?.trim().replace(/\/$/, "");
  const tenantKey = process.env.TENANT_API_KEY?.trim();

  if (!baseUrl) {
    throw new Error(
      "Falta STOREFRONT_API_URL. Configura la URL del storefront en las variables de entorno del servidor.",
    );
  }
  if (!tenantKey) {
    throw new Error(
      "Falta TENANT_API_KEY. Configura la API Key del tenant en las variables de entorno del servidor.",
    );
  }

  return { baseUrl, tenantKey };
}

function resolveUrl(path: string): string {
  const { baseUrl } = getStorefrontConfig();
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalized}`;
}

export async function storefrontFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { tenantKey } = getStorefrontConfig();
  const url = resolveUrl(path);
  const method = (init?.method ?? "GET").toUpperCase();

  const headers = new Headers(init?.headers);
  if (tenantKey) headers.set("X-Tenant-Key", tenantKey);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...init, method, headers });

  if (!response.ok) {
    const text = await response.text();
    let message = response.statusText;
    try {
      const data = JSON.parse(text);
      if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
      throw new StorefrontApiError(message, response.status, data);
    } catch (e) {
      if (e instanceof StorefrontApiError) throw e;
      throw new StorefrontApiError(message, response.status, text);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
