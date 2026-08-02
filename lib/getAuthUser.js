import { verifyToken } from "@/lib/auth";

export function getAuthUser(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    return null;
  }

  return { userId: decoded.userId };
}