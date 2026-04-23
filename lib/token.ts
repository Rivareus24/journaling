export function isValidToken(
  token: string | undefined,
  secret: string | undefined
): boolean {
  if (!token || !secret) return false
  return token === secret
}
