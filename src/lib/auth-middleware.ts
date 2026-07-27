/**
 * Auth middleware for protected API routes
 */

import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export interface AuthContext {
  userId: string;
  email: string;
}

/**
 * Extract and verify JWT from request
 */
export function getAuthContext(request: NextRequest): AuthContext | null {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyToken(token) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    console.warn("[Auth] Invalid token:", (error as Error).message);
    return null;
  }
}

/**
 * Require auth - throw error if not authenticated
 */
export function requireAuth(request: NextRequest): AuthContext {
  const auth = getAuthContext(request);
  
  if (!auth) {
    throw new Error("Unauthorized");
  }

  return auth;
}
