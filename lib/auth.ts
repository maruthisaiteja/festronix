import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "festronix_sac_vce_secret_key_2026_december_super_jwt";
export const AUTH_COOKIE_NAME = "fx26_session";

export interface AuthSessionPayload {
  userId: string;
  username: string;
  name: string;
  role: "ADMIN" | "COORDINATOR";
  assignedEventId: string | null;
  assignedVenue: string | null;
}

export function signToken(payload: AuthSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSessionPayload;
  } catch {
    return null;
  }
}

export function getSessionFromCookies(): AuthSessionPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): AuthSessionPayload | null {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
