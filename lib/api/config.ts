export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://project-luxury-carstore-production.up.railway.app"
    : "http://localhost:8080");

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    return "http://localhost:8080";
  }
  return process.env.NODE_ENV === "production"
    ? "https://project-luxury-carstore-production.up.railway.app"
    : "http://localhost:8080";
}
