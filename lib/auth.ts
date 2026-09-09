import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
const COOKIE = "egymedya_admin";
const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "development-secret-change-me");
export async function createSession(email: string) { const token = await new SignJWT({ email, role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret); (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 }); }
export async function getSession() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return null; try { return (await jwtVerify(token, secret)).payload as { email: string; role: string }; } catch { return null; } }
export async function clearSession() { (await cookies()).delete(COOKIE); }