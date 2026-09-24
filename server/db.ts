import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  blogPosts,
  contactMessages,
  educations,
  experiences,
  InsertUser,
  portfolioProfiles,
  projects,
  skills,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });

  if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  } else if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getPortfolioData() {
  const db = await requireDb();
  const [profile] = await db.select().from(portfolioProfiles).limit(1);
  const [skillItems, experienceItems, educationItems] = await Promise.all([
    db.select().from(skills).orderBy(asc(skills.displayOrder)),
    db.select().from(experiences).orderBy(asc(experiences.displayOrder)),
    db.select().from(educations).orderBy(asc(educations.displayOrder)),
  ]);
  return { profile, skills: skillItems, experiences: experienceItems, educations: educationItems };
}

export async function updateProfile(values: Partial<typeof portfolioProfiles.$inferInsert>) {
  const db = await requireDb();
  const [profile] = await db.select().from(portfolioProfiles).limit(1);
  if (!profile) throw new Error("Portfolio profile has not been initialized");
  await db.update(portfolioProfiles).set(values).where(eq(portfolioProfiles.id, profile.id));
  const [updated] = await db.select().from(portfolioProfiles).where(eq(portfolioProfiles.id, profile.id));
  return updated;
}

export async function createSkill(values: typeof skills.$inferInsert) {
  const db = await requireDb();
  const result = await db.insert(skills).values(values);
  const [created] = await db.select().from(skills).where(eq(skills.id, Number(result[0].insertId)));
  return created;
}

export async function updateSkill(id: number, values: Partial<typeof skills.$inferInsert>) {
  const db = await requireDb();
  await db.update(skills).set(values).where(eq(skills.id, id));
}

export async function deleteSkill(id: number) {
  const db = await requireDb();
  await db.delete(skills).where(eq(skills.id, id));
}

export async function createExperience(values: typeof experiences.$inferInsert) {
  const db = await requireDb();
  const result = await db.insert(experiences).values(values);
  const [created] = await db.select().from(experiences).where(eq(experiences.id, Number(result[0].insertId)));
  return created;
}

export async function updateExperience(id: number, values: Partial<typeof experiences.$inferInsert>) {
  const db = await requireDb();
  await db.update(experiences).set(values).where(eq(experiences.id, id));
}

export async function deleteExperience(id: number) {
  const db = await requireDb();
  await db.delete(experiences).where(eq(experiences.id, id));
}

export async function createEducation(values: typeof educations.$inferInsert) {
  const db = await requireDb();
  const result = await db.insert(educations).values(values);
  const [created] = await db.select().from(educations).where(eq(educations.id, Number(result[0].insertId)));
  return created;
}

export async function updateEducation(id: number, values: Partial<typeof educations.$inferInsert>) {
  const db = await requireDb();
  await db.update(educations).set(values).where(eq(educations.id, id));
}

export async function deleteEducation(id: number) {
  const db = await requireDb();
  await db.delete(educations).where(eq(educations.id, id));
}

export async function listProjects(publishedOnly: boolean) {
  const db = await requireDb();
  const query = db.select().from(projects).orderBy(asc(projects.displayOrder), desc(projects.updatedAt));
  return publishedOnly ? query.where(eq(projects.isPublished, true)) : query;
}

export async function getProjectBySlug(slug: string, publishedOnly: boolean) {
  const db = await requireDb();
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  const project = rows[0];
  return project && (!publishedOnly || project.isPublished) ? project : undefined;
}

export async function createProject(values: typeof projects.$inferInsert) {
  const db = await requireDb();
  const result = await db.insert(projects).values(values);
  const [created] = await db.select().from(projects).where(eq(projects.id, Number(result[0].insertId)));
  return created;
}

export async function updateProject(id: number, values: Partial<typeof projects.$inferInsert>) {
  const db = await requireDb();
  await db.update(projects).set(values).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await requireDb();
  await db.delete(projects).where(eq(projects.id, id));
}

export async function listPosts(publishedOnly: boolean) {
  const db = await requireDb();
  const query = db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.updatedAt));
  return publishedOnly ? query.where(eq(blogPosts.isPublished, true)) : query;
}

export async function getPostBySlug(slug: string, publishedOnly: boolean) {
  const db = await requireDb();
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  const post = rows[0];
  return post && (!publishedOnly || post.isPublished) ? post : undefined;
}

export async function createPost(values: typeof blogPosts.$inferInsert) {
  const db = await requireDb();
  const result = await db.insert(blogPosts).values(values);
  const [created] = await db.select().from(blogPosts).where(eq(blogPosts.id, Number(result[0].insertId)));
  return created;
}

export async function updatePost(id: number, values: Partial<typeof blogPosts.$inferInsert>) {
  const db = await requireDb();
  await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
}

export async function deletePost(id: number) {
  const db = await requireDb();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function createContactMessage(values: typeof contactMessages.$inferInsert) {
  const db = await requireDb();
  const result = await db.insert(contactMessages).values(values);
  const [created] = await db.select().from(contactMessages).where(eq(contactMessages.id, Number(result[0].insertId)));
  return created;
}

export async function markContactMessageNotified(id: number, sent: boolean) {
  const db = await requireDb();
  await db.update(contactMessages).set({ notificationSent: sent }).where(eq(contactMessages.id, id));
}

export async function listContactMessages() {
  const db = await requireDb();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
