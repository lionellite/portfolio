// api/index.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import sanitizeHtml from "sanitize-html";
import { z as z2 } from "zod";

// server/db.ts
import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var portfolioProfiles = mysqlTable("portfolio_profiles", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  headline: varchar("headline", { length: 240 }).notNull(),
  bio: text("bio").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  location: varchar("location", { length: 160 }),
  linkedinUrl: varchar("linkedinUrl", { length: 512 }),
  githubUrl: varchar("githubUrl", { length: 512 }),
  photoUrl: varchar("photoUrl", { length: 1024 }),
  photoKey: varchar("photoKey", { length: 512 }),
  availability: varchar("availability", { length: 240 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 120 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  proficiency: varchar("proficiency", { length: 80 }),
  displayOrder: int("displayOrder").default(0).notNull()
});
var experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  organization: varchar("organization", { length: 220 }).notNull(),
  location: varchar("location", { length: 160 }),
  startDate: varchar("startDate", { length: 80 }).notNull(),
  endDate: varchar("endDate", { length: 80 }),
  isCurrent: boolean("isCurrent").default(false).notNull(),
  description: text("description").notNull(),
  displayOrder: int("displayOrder").default(0).notNull()
});
var educations = mysqlTable("educations", {
  id: int("id").autoincrement().primaryKey(),
  credential: varchar("credential", { length: 260 }).notNull(),
  institution: varchar("institution", { length: 220 }).notNull(),
  location: varchar("location", { length: 160 }),
  startDate: varchar("startDate", { length: 80 }),
  endDate: varchar("endDate", { length: 80 }),
  description: text("description"),
  displayOrder: int("displayOrder").default(0).notNull()
});
var projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  shortDescription: text("shortDescription").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").notNull(),
  projectUrl: varchar("projectUrl", { length: 1024 }),
  githubUrl: varchar("githubUrl", { length: 1024 }),
  coverImageUrl: varchar("coverImageUrl", { length: 1024 }),
  coverImageKey: varchar("coverImageKey", { length: 512 }),
  isPublished: boolean("isPublished").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  tags: text("tags").notNull(),
  coverImageUrl: varchar("coverImageUrl", { length: 1024 }),
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  notificationSent: boolean("notificationSent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values = { openId: user.openId, lastSignedIn: /* @__PURE__ */ new Date() };
  const updateSet = { lastSignedIn: /* @__PURE__ */ new Date() };
  ["name", "email", "loginMethod"].forEach((field) => {
    if (user[field] !== void 0) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  } else if (user.role !== void 0) {
    values.role = user.role;
    updateSet.role = user.role;
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}
async function getPortfolioData() {
  const db = await requireDb();
  const [profile] = await db.select().from(portfolioProfiles).limit(1);
  const [skillItems, experienceItems, educationItems] = await Promise.all([
    db.select().from(skills).orderBy(asc(skills.displayOrder)),
    db.select().from(experiences).orderBy(asc(experiences.displayOrder)),
    db.select().from(educations).orderBy(asc(educations.displayOrder))
  ]);
  return { profile, skills: skillItems, experiences: experienceItems, educations: educationItems };
}
async function updateProfile(values) {
  const db = await requireDb();
  const [profile] = await db.select().from(portfolioProfiles).limit(1);
  if (!profile) throw new Error("Portfolio profile has not been initialized");
  await db.update(portfolioProfiles).set(values).where(eq(portfolioProfiles.id, profile.id));
  const [updated] = await db.select().from(portfolioProfiles).where(eq(portfolioProfiles.id, profile.id));
  return updated;
}
async function createSkill(values) {
  const db = await requireDb();
  const result = await db.insert(skills).values(values);
  const [created] = await db.select().from(skills).where(eq(skills.id, Number(result[0].insertId)));
  return created;
}
async function updateSkill(id, values) {
  const db = await requireDb();
  await db.update(skills).set(values).where(eq(skills.id, id));
}
async function deleteSkill(id) {
  const db = await requireDb();
  await db.delete(skills).where(eq(skills.id, id));
}
async function createExperience(values) {
  const db = await requireDb();
  const result = await db.insert(experiences).values(values);
  const [created] = await db.select().from(experiences).where(eq(experiences.id, Number(result[0].insertId)));
  return created;
}
async function updateExperience(id, values) {
  const db = await requireDb();
  await db.update(experiences).set(values).where(eq(experiences.id, id));
}
async function deleteExperience(id) {
  const db = await requireDb();
  await db.delete(experiences).where(eq(experiences.id, id));
}
async function createEducation(values) {
  const db = await requireDb();
  const result = await db.insert(educations).values(values);
  const [created] = await db.select().from(educations).where(eq(educations.id, Number(result[0].insertId)));
  return created;
}
async function updateEducation(id, values) {
  const db = await requireDb();
  await db.update(educations).set(values).where(eq(educations.id, id));
}
async function deleteEducation(id) {
  const db = await requireDb();
  await db.delete(educations).where(eq(educations.id, id));
}
async function listProjects(publishedOnly) {
  const db = await requireDb();
  const query = db.select().from(projects).orderBy(asc(projects.displayOrder), desc(projects.updatedAt));
  return publishedOnly ? query.where(eq(projects.isPublished, true)) : query;
}
async function getProjectBySlug(slug, publishedOnly) {
  const db = await requireDb();
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  const project = rows[0];
  return project && (!publishedOnly || project.isPublished) ? project : void 0;
}
async function createProject(values) {
  const db = await requireDb();
  const result = await db.insert(projects).values(values);
  const [created] = await db.select().from(projects).where(eq(projects.id, Number(result[0].insertId)));
  return created;
}
async function updateProject(id, values) {
  const db = await requireDb();
  await db.update(projects).set(values).where(eq(projects.id, id));
}
async function deleteProject(id) {
  const db = await requireDb();
  await db.delete(projects).where(eq(projects.id, id));
}
async function listPosts(publishedOnly) {
  const db = await requireDb();
  const query = db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.updatedAt));
  return publishedOnly ? query.where(eq(blogPosts.isPublished, true)) : query;
}
async function getPostBySlug(slug, publishedOnly) {
  const db = await requireDb();
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  const post = rows[0];
  return post && (!publishedOnly || post.isPublished) ? post : void 0;
}
async function createPost(values) {
  const db = await requireDb();
  const result = await db.insert(blogPosts).values(values);
  const [created] = await db.select().from(blogPosts).where(eq(blogPosts.id, Number(result[0].insertId)));
  return created;
}
async function updatePost(id, values) {
  const db = await requireDb();
  await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
}
async function deletePost(id) {
  const db = await requireDb();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}
async function createContactMessage(values) {
  const db = await requireDb();
  const result = await db.insert(contactMessages).values(values);
  const [created] = await db.select().from(contactMessages).where(eq(contactMessages.id, Number(result[0].insertId)));
  return created;
}
async function markContactMessageNotified(id, sent) {
  const db = await requireDb();
  await db.update(contactMessages).set({ notificationSent: sent }).where(eq(contactMessages.id, id));
}
async function listContactMessages() {
  const db = await requireDb();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    const isOwner = Boolean(ctx.user && ENV.ownerOpenId && ctx.user.openId === ENV.ownerOpenId);
    if (!ctx.user || ctx.user.role !== "admin" && !isOwner) {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
import { z } from "zod";
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/email.ts
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
async function sendContactEmail(input) {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY is missing.");
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Portfolio de Lionel <onboarding@resend.dev>",
      to: [input.recipient],
      reply_to: input.visitorEmail,
      subject: `Nouveau message portfolio \u2014 ${input.visitorName}`,
      text: `Bonjour ${input.senderName},

Vous avez re\xE7u un nouveau message depuis votre portfolio.

De : ${input.visitorName} <${input.visitorEmail}>

${input.message}`,
      html: `<p>Bonjour ${escapeHtml(input.senderName)},</p><p>Vous avez re\xE7u un nouveau message depuis votre portfolio.</p><p><strong>De :</strong> ${escapeHtml(input.visitorName)} &lt;${escapeHtml(input.visitorEmail)}&gt;</p><blockquote>${escapeHtml(input.message).replaceAll("\n", "<br />")}</blockquote>`
    })
  });
  if (!response.ok) {
    console.warn(`[Email] Resend rejected contact notification (${response.status}).`);
    return false;
  }
  return true;
}

// server/storage.ts
function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;
  if (!forgeUrl || !forgeKey) {
    throw new Error(
      "Storage config missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function appendHashSuffix(relKey) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);
  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` }
  });
  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }
  const { url: s3Url } = await presignResp.json();
  if (!s3Url) throw new Error("Forge returned empty presign URL");
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob
  });
  if (!uploadResp.ok) {
    throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  }
  return { key, url: `/manus-storage/${key}` };
}

// server/routers.ts
var stringList = z2.array(z2.string().trim().min(1).max(80)).max(20);
var optionalUrl = z2.string().url().max(1024).optional().nullable();
var optionalText = (max) => z2.string().trim().max(max).optional().nullable();
var sanitizeRichText = (value) => sanitizeHtml(value, {
  allowedTags: ["p", "br", "strong", "em", "u", "s", "ul", "ol", "li", "h2", "h3", "blockquote", "a", "code", "pre"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"]
});
var profileInput = z2.object({
  fullName: z2.string().trim().min(2).max(160),
  headline: z2.string().trim().min(3).max(240),
  bio: z2.string().trim().min(20).max(5e3),
  email: z2.string().trim().email().max(320),
  phone: optionalText(40),
  location: optionalText(160),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  photoUrl: optionalUrl,
  photoKey: optionalText(512),
  availability: optionalText(240)
});
var skillInput = z2.object({
  category: z2.string().trim().min(2).max(120),
  name: z2.string().trim().min(1).max(160),
  proficiency: optionalText(80),
  displayOrder: z2.number().int().min(0).max(999)
});
var experienceInput = z2.object({
  title: z2.string().trim().min(2).max(220),
  organization: z2.string().trim().min(2).max(220),
  location: optionalText(160),
  startDate: z2.string().trim().min(2).max(80),
  endDate: optionalText(80),
  isCurrent: z2.boolean(),
  description: z2.string().trim().min(10).max(5e3),
  displayOrder: z2.number().int().min(0).max(999)
});
var educationInput = z2.object({
  credential: z2.string().trim().min(2).max(260),
  institution: z2.string().trim().min(2).max(220),
  location: optionalText(160),
  startDate: optionalText(80),
  endDate: optionalText(80),
  description: optionalText(5e3),
  displayOrder: z2.number().int().min(0).max(999)
});
var projectInput = z2.object({
  slug: z2.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(191),
  title: z2.string().trim().min(2).max(220),
  shortDescription: z2.string().trim().min(10).max(800),
  description: z2.string().trim().min(20).max(1e4),
  technologies: stringList,
  projectUrl: optionalUrl,
  githubUrl: optionalUrl,
  coverImageUrl: optionalUrl,
  coverImageKey: optionalText(512),
  isPublished: z2.boolean(),
  isFeatured: z2.boolean(),
  displayOrder: z2.number().int().min(0).max(999)
});
var postInput = z2.object({
  slug: z2.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(191),
  title: z2.string().trim().min(3).max(240),
  excerpt: z2.string().trim().min(10).max(800),
  content: z2.string().trim().min(20).max(5e4).transform(sanitizeRichText),
  tags: stringList,
  coverImageUrl: optionalUrl,
  isPublished: z2.boolean()
});
function parseList(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}
function formatProject(project) {
  const { technologies, ...rest } = project;
  return { ...rest, technologies: parseList(technologies) };
}
function formatPost(post) {
  const { tags, ...rest } = post;
  return { ...rest, tags: parseList(tags) };
}
function parseImage(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|webp|avif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new TRPCError3({ code: "BAD_REQUEST", message: "Le fichier doit \xEAtre une image PNG, JPEG, WebP ou AVIF." });
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 5 * 1024 * 1024) throw new TRPCError3({ code: "PAYLOAD_TOO_LARGE", message: "L\u2019image ne doit pas d\xE9passer 5 Mo." });
  return { contentType: match[1], bytes };
}
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => {
      const user = opts.ctx.user;
      if (user && ENV.ownerOpenId && user.openId === ENV.ownerOpenId && user.role !== "admin") {
        return { ...user, role: "admin" };
      }
      return user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  portfolio: router({
    get: publicProcedure.query(() => getPortfolioData()),
    updateProfile: adminProcedure.input(profileInput).mutation(({ input }) => updateProfile(input)),
    createSkill: adminProcedure.input(skillInput).mutation(({ input }) => createSkill(input)),
    updateSkill: adminProcedure.input(z2.object({ id: z2.number().int().positive(), data: skillInput })).mutation(({ input }) => updateSkill(input.id, input.data)),
    deleteSkill: adminProcedure.input(z2.object({ id: z2.number().int().positive() })).mutation(({ input }) => deleteSkill(input.id)),
    createExperience: adminProcedure.input(experienceInput).mutation(({ input }) => createExperience(input)),
    updateExperience: adminProcedure.input(z2.object({ id: z2.number().int().positive(), data: experienceInput })).mutation(({ input }) => updateExperience(input.id, input.data)),
    deleteExperience: adminProcedure.input(z2.object({ id: z2.number().int().positive() })).mutation(({ input }) => deleteExperience(input.id)),
    createEducation: adminProcedure.input(educationInput).mutation(({ input }) => createEducation(input)),
    updateEducation: adminProcedure.input(z2.object({ id: z2.number().int().positive(), data: educationInput })).mutation(({ input }) => updateEducation(input.id, input.data)),
    deleteEducation: adminProcedure.input(z2.object({ id: z2.number().int().positive() })).mutation(({ input }) => deleteEducation(input.id)),
    uploadImage: adminProcedure.input(z2.object({ dataUrl: z2.string().min(20), fileName: z2.string().trim().min(1).max(160) })).mutation(async ({ ctx, input }) => {
      const { bytes, contentType } = parseImage(input.dataUrl);
      const extension = contentType.split("/")[1] === "jpeg" ? "jpg" : contentType.split("/")[1];
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100);
      const { key, url } = await storagePut(`portfolio/${ctx.user.id}/${Date.now()}-${safeName}.${extension}`, bytes, contentType);
      return { key, url };
    })
  }),
  projects: router({
    list: publicProcedure.query(async () => (await listProjects(true)).map(formatProject)),
    listAll: adminProcedure.query(async () => (await listProjects(false)).map(formatProject)),
    bySlug: publicProcedure.input(z2.object({ slug: z2.string().min(1).max(191) })).query(async ({ input }) => {
      const project = await getProjectBySlug(input.slug, true);
      if (!project) throw new TRPCError3({ code: "NOT_FOUND", message: "Projet introuvable." });
      return formatProject(project);
    }),
    create: adminProcedure.input(projectInput).mutation(async ({ input }) => createProject({ ...input, technologies: JSON.stringify(input.technologies) })),
    update: adminProcedure.input(z2.object({ id: z2.number().int().positive(), data: projectInput })).mutation(({ input }) => updateProject(input.id, { ...input.data, technologies: JSON.stringify(input.data.technologies) })),
    delete: adminProcedure.input(z2.object({ id: z2.number().int().positive() })).mutation(({ input }) => deleteProject(input.id))
  }),
  blog: router({
    list: publicProcedure.query(async () => (await listPosts(true)).map(formatPost)),
    listAll: adminProcedure.query(async () => (await listPosts(false)).map(formatPost)),
    bySlug: publicProcedure.input(z2.object({ slug: z2.string().min(1).max(191) })).query(async ({ input }) => {
      const post = await getPostBySlug(input.slug, true);
      if (!post) throw new TRPCError3({ code: "NOT_FOUND", message: "Article introuvable." });
      return formatPost(post);
    }),
    create: adminProcedure.input(postInput).mutation(async ({ input }) => createPost({ ...input, tags: JSON.stringify(input.tags), publishedAt: input.isPublished ? /* @__PURE__ */ new Date() : null })),
    update: adminProcedure.input(z2.object({ id: z2.number().int().positive(), data: postInput })).mutation(async ({ input }) => {
      const current = await listPosts(false);
      const existing = current.find((post) => post.id === input.id);
      const publishNow = input.data.isPublished && !existing?.isPublished ? /* @__PURE__ */ new Date() : existing?.publishedAt ?? null;
      return updatePost(input.id, { ...input.data, tags: JSON.stringify(input.data.tags), publishedAt: publishNow });
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number().int().positive() })).mutation(({ input }) => deletePost(input.id))
  }),
  contact: router({
    submit: publicProcedure.input(z2.object({
      name: z2.string().trim().min(2).max(160),
      email: z2.string().trim().email().max(320),
      message: z2.string().trim().min(10).max(5e3)
    })).mutation(async ({ input }) => {
      const saved = await createContactMessage(input);
      const portfolio = await getPortfolioData();
      const emailSent = portfolio.profile ? await sendContactEmail({
        recipient: portfolio.profile.email,
        senderName: portfolio.profile.fullName,
        visitorName: input.name,
        visitorEmail: input.email,
        message: input.message
      }) : false;
      const ownerNotified = await notifyOwner({
        title: `Nouveau message de ${input.name}`,
        content: `De : ${input.name} <${input.email}>

${input.message}`
      });
      await markContactMessageNotified(saved.id, emailSent || ownerNotified);
      return { success: true };
    }),
    list: adminProcedure.query(() => listContactMessages())
  })
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// api/index.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "portfolio-api" });
});
var index_default = app;
export {
  index_default as default
};
