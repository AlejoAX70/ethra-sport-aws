/** CDN CloudFront para imágenes (reemplaza URLs de S3 del API) */
export const IMAGE_CDN_BASE = "https://dvt8oixa5wj3m.cloudfront.net";

const S3_HOST = "app-imagenes-stock-ecommerce.s3.us-east-2.amazonaws.com";

/** Convierte una URL de S3 (o ruta relativa) a la URL del CDN */
export function toCdnImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/")) {
    return `${IMAGE_CDN_BASE}${url}`;
  }
  if (url.includes("dvt8oixa5wj3m.cloudfront.net")) {
    return url;
  }
  return url
    .replace(`https://${S3_HOST}`, IMAGE_CDN_BASE)
    .replace(`http://${S3_HOST}`, IMAGE_CDN_BASE);
}
