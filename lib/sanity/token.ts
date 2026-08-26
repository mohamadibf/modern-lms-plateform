import "server-only";

export function getReadToken(): string {
  const value = process.env.SANITY_API_READ_TOKEN;
  if (!value) {
    throw new Error("Missing environment variable: SANITY_API_READ_TOKEN");
  }
  return value;
}
