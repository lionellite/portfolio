import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { parse as parseCookies } from "cookie";
import type { User } from "../../drizzle/schema";
import { ENV } from "./env";

export const LOCAL_ADMIN_COOKIE = "portfolio_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const attempts = new Map<string, { count: number; resetAt: number }>();

function secretKey() {
  return ENV.cookieSecret || "development-only-change-me";
}

export function hashAdminPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyAdminPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH ?? "";
  const [algorithm, salt, expected] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expected || expected.length !== 128) return false;
  try {
    const actual = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
    return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

function signature(payload: string) {
  return createHmac("sha256", secretKey()).update(payload).digest("base64url");
}

export function createAdminSession(res: Response, req: Request) {
  const payload = `admin.${Date.now() + SESSION_TTL_MS}`;
  const token = `${payload}.${signature(payload)}`;
  res.cookie(LOCAL_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS,
  });
}

export function clearAdminSession(res: Response) {
  res.clearCookie(LOCAL_ADMIN_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
}

export function isValidAdminSession(req: Request) {
  const token = parseCookies(req.headers.cookie ?? "")[LOCAL_ADMIN_COOKIE];
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = signature(payload);
  if (parts[2].length !== expected.length) return false;
  try {
    return Number(parts[1]) > Date.now() && timingSafeEqual(Buffer.from(parts[2]), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function getLocalAdminUser(): User {
  const now = new Date();
  return {
    id: 0,
    openId: "local-admin",
    name: "Lionel Adoukonou",
    email: "admin@local.portfolio",
    loginMethod: "password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  return current.count >= 5;
}

export function recordFailedAttempt(key: string) {
  const current = attempts.get(key) ?? { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  current.count += 1;
  attempts.set(key, current);
}
