import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { sendContactEmail } from "./email";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";

const stringList = z.array(z.string().trim().min(1).max(80)).max(20);
const optionalUrl = z.string().url().max(1024).optional().nullable();
const optionalText = (max: number) => z.string().trim().max(max).optional().nullable();
export const sanitizeRichText = (value: string) => sanitizeHtml(value, {
  allowedTags: ["p", "br", "strong", "em", "u", "s", "ul", "ol", "li", "h2", "h3", "blockquote", "a", "code", "pre"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
});

const profileInput = z.object({
  fullName: z.string().trim().min(2).max(160),
  headline: z.string().trim().min(3).max(240),
  bio: z.string().trim().min(20).max(5000),
  email: z.string().trim().email().max(320),
  phone: optionalText(40),
  location: optionalText(160),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  photoUrl: optionalUrl,
  photoKey: optionalText(512),
  availability: optionalText(240),
});

const skillInput = z.object({
  category: z.string().trim().min(2).max(120),
  name: z.string().trim().min(1).max(160),
  proficiency: optionalText(80),
  displayOrder: z.number().int().min(0).max(999),
});

const experienceInput = z.object({
  title: z.string().trim().min(2).max(220),
  organization: z.string().trim().min(2).max(220),
  location: optionalText(160),
  startDate: z.string().trim().min(2).max(80),
  endDate: optionalText(80),
  isCurrent: z.boolean(),
  description: z.string().trim().min(10).max(5000),
  displayOrder: z.number().int().min(0).max(999),
});

const educationInput = z.object({
  credential: z.string().trim().min(2).max(260),
  institution: z.string().trim().min(2).max(220),
  location: optionalText(160),
  startDate: optionalText(80),
  endDate: optionalText(80),
  description: optionalText(5000),
  displayOrder: z.number().int().min(0).max(999),
});

const projectInput = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(191),
  title: z.string().trim().min(2).max(220),
  shortDescription: z.string().trim().min(10).max(800),
  description: z.string().trim().min(20).max(10000),
  technologies: stringList,
  projectUrl: optionalUrl,
  githubUrl: optionalUrl,
  coverImageUrl: optionalUrl,
  coverImageKey: optionalText(512),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  displayOrder: z.number().int().min(0).max(999),
});

const postInput = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(191),
  title: z.string().trim().min(3).max(240),
  excerpt: z.string().trim().min(10).max(800),
  content: z.string().trim().min(20).max(50000).transform(sanitizeRichText),
  tags: stringList,
  coverImageUrl: optionalUrl,
  isPublished: z.boolean(),
});

function parseList(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function formatProject(project: Awaited<ReturnType<typeof db.listProjects>>[number]) {
  const { technologies, ...rest } = project;
  return { ...rest, technologies: parseList(technologies) };
}

function formatPost(post: Awaited<ReturnType<typeof db.listPosts>>[number]) {
  const { tags, ...rest } = post;
  return { ...rest, tags: parseList(tags) };
}

function parseImage(dataUrl: string) {
  const match = /^data:(image\/(?:png|jpeg|webp|avif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new TRPCError({ code: "BAD_REQUEST", message: "Le fichier doit être une image PNG, JPEG, WebP ou AVIF." });
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 5 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "L’image ne doit pas dépasser 5 Mo." });
  return { contentType: match[1], bytes };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => {
      const user = opts.ctx.user;
      if (user && ENV.ownerOpenId && user.openId === ENV.ownerOpenId && user.role !== "admin") {
        return { ...user, role: "admin" as const };
      }
      return user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  portfolio: router({
    get: publicProcedure.query(() => db.getPortfolioData()),
    updateProfile: adminProcedure.input(profileInput).mutation(({ input }) => db.updateProfile(input)),
    createSkill: adminProcedure.input(skillInput).mutation(({ input }) => db.createSkill(input)),
    updateSkill: adminProcedure.input(z.object({ id: z.number().int().positive(), data: skillInput })).mutation(({ input }) => db.updateSkill(input.id, input.data)),
    deleteSkill: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deleteSkill(input.id)),
    createExperience: adminProcedure.input(experienceInput).mutation(({ input }) => db.createExperience(input)),
    updateExperience: adminProcedure.input(z.object({ id: z.number().int().positive(), data: experienceInput })).mutation(({ input }) => db.updateExperience(input.id, input.data)),
    deleteExperience: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deleteExperience(input.id)),
    createEducation: adminProcedure.input(educationInput).mutation(({ input }) => db.createEducation(input)),
    updateEducation: adminProcedure.input(z.object({ id: z.number().int().positive(), data: educationInput })).mutation(({ input }) => db.updateEducation(input.id, input.data)),
    deleteEducation: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deleteEducation(input.id)),
    uploadImage: adminProcedure.input(z.object({ dataUrl: z.string().min(20), fileName: z.string().trim().min(1).max(160) })).mutation(async ({ ctx, input }) => {
      const { bytes, contentType } = parseImage(input.dataUrl);
      const extension = contentType.split("/")[1] === "jpeg" ? "jpg" : contentType.split("/")[1];
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100);
      const { key, url } = await storagePut(`portfolio/${ctx.user.id}/${Date.now()}-${safeName}.${extension}`, bytes, contentType);
      return { key, url };
    }),
  }),
  projects: router({
    list: publicProcedure.query(async () => (await db.listProjects(true)).map(formatProject)),
    listAll: adminProcedure.query(async () => (await db.listProjects(false)).map(formatProject)),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(191) })).query(async ({ input }) => {
      const project = await db.getProjectBySlug(input.slug, true);
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Projet introuvable." });
      return formatProject(project);
    }),
    create: adminProcedure.input(projectInput).mutation(async ({ input }) => db.createProject({ ...input, technologies: JSON.stringify(input.technologies) })),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), data: projectInput })).mutation(({ input }) => db.updateProject(input.id, { ...input.data, technologies: JSON.stringify(input.data.technologies) })),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deleteProject(input.id)),
  }),
  blog: router({
    list: publicProcedure.query(async () => (await db.listPosts(true)).map(formatPost)),
    listAll: adminProcedure.query(async () => (await db.listPosts(false)).map(formatPost)),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(191) })).query(async ({ input }) => {
      const post = await db.getPostBySlug(input.slug, true);
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Article introuvable." });
      return formatPost(post);
    }),
    create: adminProcedure.input(postInput).mutation(async ({ input }) => db.createPost({ ...input, tags: JSON.stringify(input.tags), publishedAt: input.isPublished ? new Date() : null })),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), data: postInput })).mutation(async ({ input }) => {
      const current = await db.listPosts(false);
      const existing = current.find(post => post.id === input.id);
      const publishNow = input.data.isPublished && !existing?.isPublished ? new Date() : existing?.publishedAt ?? null;
      return db.updatePost(input.id, { ...input.data, tags: JSON.stringify(input.data.tags), publishedAt: publishNow });
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deletePost(input.id)),
  }),
  contact: router({
    submit: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(160),
      email: z.string().trim().email().max(320),
      message: z.string().trim().min(10).max(5000),
    })).mutation(async ({ input }) => {
      const saved = await db.createContactMessage(input);
      const portfolio = await db.getPortfolioData();
      const emailSent = portfolio.profile
        ? await sendContactEmail({
            recipient: portfolio.profile.email,
            senderName: portfolio.profile.fullName,
            visitorName: input.name,
            visitorEmail: input.email,
            message: input.message,
          })
        : false;
      const ownerNotified = await notifyOwner({
        title: `Nouveau message de ${input.name}`,
        content: `De : ${input.name} <${input.email}>\n\n${input.message}`,
      });
      await db.markContactMessageNotified(saved.id, emailSent || ownerNotified);
      return { success: true } as const;
    }),
    list: adminProcedure.query(() => db.listContactMessages()),
  }),
});

export type AppRouter = typeof appRouter;
