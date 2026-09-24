import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createSkill: vi.fn().mockResolvedValue({ id: 1 }),
  updateProfile: vi.fn().mockResolvedValue({ id: 1 }),
  createExperience: vi.fn().mockResolvedValue({ id: 4 }),
  updateExperience: vi.fn().mockResolvedValue(undefined),
  deleteExperience: vi.fn().mockResolvedValue(undefined),
  createEducation: vi.fn().mockResolvedValue({ id: 5 }),
  updateEducation: vi.fn().mockResolvedValue(undefined),
  deleteEducation: vi.fn().mockResolvedValue(undefined),
  createProject: vi.fn().mockResolvedValue({ id: 2 }),
  updateProject: vi.fn().mockResolvedValue(undefined),
  deleteProject: vi.fn().mockResolvedValue(undefined),
  createPost: vi.fn().mockResolvedValue({ id: 3 }),
  updatePost: vi.fn().mockResolvedValue(undefined),
  deletePost: vi.fn().mockResolvedValue(undefined),
  listPosts: vi.fn().mockResolvedValue([{ id: 3, isPublished: false, publishedAt: null }]),
}));
vi.mock("./storage", () => ({ storagePut: vi.fn().mockResolvedValue({ key: "portfolio/7/cover.png", url: "/manus-storage/portfolio/7/cover.png" }) }));

import * as db from "./db";
import { appRouter } from "./routers";
import { storagePut } from "./storage";
import type { TrpcContext } from "./_core/context";

const ctx: TrpcContext = {
  user: { id: 7, openId: "owner", name: "Lionel", email: "lionel@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: { clearCookie: () => undefined } as TrpcContext["res"],
};

describe("mutations de contenu du portfolio", () => {
  it("crée une compétence administrateur via le contrat tRPC", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.portfolio.createSkill({ category: "Backend", name: "FastAPI", proficiency: "Pratique", displayOrder: 1 });
    expect(db.createSkill).toHaveBeenCalledWith({ category: "Backend", name: "FastAPI", proficiency: "Pratique", displayOrder: 1 });
  });

  it("crée un projet en sérialisant la liste des technologies", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.projects.create({ slug: "outil-api", title: "Outil API", shortDescription: "Résumé suffisamment détaillé pour le contrat.", description: "Description suffisamment détaillée pour satisfaire la validation de création.", technologies: ["Python", "FastAPI"], projectUrl: null, githubUrl: null, coverImageUrl: null, coverImageKey: null, isPublished: true, isFeatured: false, displayOrder: 4 });
    expect(db.createProject).toHaveBeenCalledWith(expect.objectContaining({ slug: "outil-api", technologies: '["Python","FastAPI"]', isPublished: true }));
  });

  it("crée un article publié en nettoyant le HTML et en fixant une date de publication", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.blog.create({ slug: "note-technique", title: "Une note technique", excerpt: "Un extrait suffisamment long pour être publié.", content: "<p>Un contenu riche suffisamment long <strong>et lisible</strong><script>evil()</script></p>", tags: ["DevOps"], coverImageUrl: null, isPublished: true });
    expect(db.createPost).toHaveBeenCalledWith(expect.objectContaining({ tags: '["DevOps"]', isPublished: true, content: expect.not.stringContaining("script"), publishedAt: expect.any(Date) }));
  });

  it("publie un article existant lors de sa mise à jour", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.blog.update({ id: 3, data: { slug: "note-technique", title: "Une note technique", excerpt: "Un extrait suffisamment long pour être publié.", content: "<p>Un contenu riche suffisamment long pour être publié proprement.</p>", tags: ["DevOps"], coverImageUrl: null, isPublished: true } });
    expect(db.updatePost).toHaveBeenCalledWith(3, expect.objectContaining({ isPublished: true, publishedAt: expect.any(Date) }));
  });

  it("envoie une image de couverture au stockage privé pour le propriétaire", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.portfolio.uploadImage({ dataUrl: "data:image/png;base64,aGVsbG8=", fileName: "cover.png" });
    expect(storagePut).toHaveBeenCalledWith(expect.stringContaining("portfolio/7/"), expect.any(Buffer), "image/png");
    expect(result).toEqual({ key: "portfolio/7/cover.png", url: "/manus-storage/portfolio/7/cover.png" });
  });

  it("met à jour le profil et le parcours professionnel", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.portfolio.updateProfile({ fullName: "Lionel Adoukonou", headline: "Backend & DevOps", bio: "Biographie suffisamment détaillée pour respecter les règles de validation du portfolio.", email: "lionel@example.com", phone: null, location: "Bénin", linkedinUrl: null, githubUrl: null, photoUrl: null, photoKey: null, availability: null });
    const experience = { title: "Développeur", organization: "LiteTECH", location: null, startDate: "2026", endDate: null, isCurrent: true, description: "Description suffisamment complète de cette expérience professionnelle.", displayOrder: 1 };
    await caller.portfolio.createExperience(experience);
    await caller.portfolio.updateExperience({ id: 4, data: { ...experience, displayOrder: 2 } });
    await caller.portfolio.deleteExperience({ id: 4 });
    expect(db.updateProfile).toHaveBeenCalledWith(expect.objectContaining({ fullName: "Lionel Adoukonou" }));
    expect(db.createExperience).toHaveBeenCalledWith(experience);
    expect(db.updateExperience).toHaveBeenCalledWith(4, expect.objectContaining({ displayOrder: 2 }));
    expect(db.deleteExperience).toHaveBeenCalledWith(4);
  });

  it("crée, modifie et supprime une formation", async () => {
    const caller = appRouter.createCaller(ctx);
    const education = { credential: "Licence informatique", institution: "INSTI", location: null, startDate: "2022", endDate: "2026", description: "Formation technique complète.", displayOrder: 1 };
    await caller.portfolio.createEducation(education);
    await caller.portfolio.updateEducation({ id: 5, data: { ...education, displayOrder: 2 } });
    await caller.portfolio.deleteEducation({ id: 5 });
    expect(db.createEducation).toHaveBeenCalledWith(education);
    expect(db.updateEducation).toHaveBeenCalledWith(5, expect.objectContaining({ displayOrder: 2 }));
    expect(db.deleteEducation).toHaveBeenCalledWith(5);
  });

  it("met à jour puis supprime un projet, y compris son statut de publication", async () => {
    const caller = appRouter.createCaller(ctx);
    const data = { slug: "outil-api", title: "Outil API", shortDescription: "Résumé suffisamment détaillé pour le contrat.", description: "Description suffisamment détaillée pour satisfaire la validation de création.", technologies: ["Python", "FastAPI"], projectUrl: null, githubUrl: null, coverImageUrl: null, coverImageKey: null, isPublished: false, isFeatured: false, displayOrder: 4 };
    await caller.projects.update({ id: 2, data });
    await caller.projects.delete({ id: 2 });
    expect(db.updateProject).toHaveBeenCalledWith(2, expect.objectContaining({ isPublished: false, technologies: '["Python","FastAPI"]' }));
    expect(db.deleteProject).toHaveBeenCalledWith(2);
  });

  it("dépublie et supprime un article existant", async () => {
    vi.mocked(db.listPosts).mockResolvedValueOnce([{ id: 8, isPublished: true, publishedAt: new Date() }] as never);
    const caller = appRouter.createCaller(ctx);
    await caller.blog.update({ id: 8, data: { slug: "note-technique", title: "Une note technique", excerpt: "Un extrait suffisamment long pour être publié.", content: "<p>Un contenu riche suffisamment long pour dépublier proprement.</p>", tags: ["DevOps"], coverImageUrl: null, isPublished: false } });
    await caller.blog.delete({ id: 8 });
    expect(db.updatePost).toHaveBeenCalledWith(8, expect.objectContaining({ isPublished: false, publishedAt: expect.any(Date) }));
    expect(db.deletePost).toHaveBeenCalledWith(8);
  });
});
