import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const portfolioProfiles = mysqlTable("portfolio_profiles", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 120 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  proficiency: varchar("proficiency", { length: 80 }),
  displayOrder: int("displayOrder").default(0).notNull(),
});

export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  organization: varchar("organization", { length: 220 }).notNull(),
  location: varchar("location", { length: 160 }),
  startDate: varchar("startDate", { length: 80 }).notNull(),
  endDate: varchar("endDate", { length: 80 }),
  isCurrent: boolean("isCurrent").default(false).notNull(),
  description: text("description").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
});

export const educations = mysqlTable("educations", {
  id: int("id").autoincrement().primaryKey(),
  credential: varchar("credential", { length: 260 }).notNull(),
  institution: varchar("institution", { length: 220 }).notNull(),
  location: varchar("location", { length: 160 }),
  startDate: varchar("startDate", { length: 80 }),
  endDate: varchar("endDate", { length: 80 }),
  description: text("description"),
  displayOrder: int("displayOrder").default(0).notNull(),
});

export const projects = mysqlTable("projects", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const blogPosts = mysqlTable("blog_posts", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  notificationSent: boolean("notificationSent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
