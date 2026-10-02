import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { clearAdminSession, createAdminSession, isRateLimited, recordFailedAttempt, verifyAdminPassword } from "../server/_core/localAuth";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.post("/api/admin/login", (req, res) => {
  const key = String(req.ip ?? "unknown");
  if (isRateLimited(key)) {
    res.status(429).json({ error: "Trop de tentatives. Réessayez dans quelques minutes." });
    return;
  }
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || !verifyAdminPassword(password)) {
    recordFailedAttempt(key);
    res.status(401).json({ error: "Mot de passe incorrect." });
    return;
  }
  createAdminSession(res, req);
  res.json({ success: true });
});
app.post("/api/admin/logout", (_req, res) => {
  clearAdminSession(res);
  res.json({ success: true });
});
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "portfolio-api" });
});

export default app;
