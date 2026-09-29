export const RAILWAY_API_URL = "https://project-luxury-carstore-production.up.railway.app";
export const LOCAL_API_URL = "http://localhost:8080";

export function getApiBaseUrl(): string {
  // If explicitly configured via environment variable and not empty
  if (process.env.NEXT_PUBLIC_API_URL) {
    // If running in browser from non-localhost (e.g. friend opening vercel or remote link), avoid localhost URL
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1" &&
      process.env.NEXT_PUBLIC_API_URL.includes("localhost")
    ) {
      return RAILWAY_API_URL;
    }
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // If in browser and accessing from outside localhost
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return RAILWAY_API_URL;
  }

  return process.env.NODE_ENV === "production" ? RAILWAY_API_URL : LOCAL_API_URL;
}

export const API_BASE_URL: string = getApiBaseUrl();

