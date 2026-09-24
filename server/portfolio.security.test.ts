import { describe, expect, it } from "vitest";
import { appRouter, sanitizeRichText } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("administration du portfolio", () => {
  it("refuse l’accès à la liste complète des projets pour un non-administrateur", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.projects.listAll()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("reconnaît le propriétaire OAuth comme administrateur", async () => {
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    if (!ownerOpenId) return;
    const context = createContext("user");
    const caller = appRouter.createCaller({ ...context, user: { ...context.user, openId: ownerOpenId } });
    await expect(caller.auth.me()).resolves.toMatchObject({ openId: ownerOpenId, role: "admin" });
  });

  it("valide le format d’un message de contact avant toute écriture", async () => {
    const caller = appRouter.createCaller({ ...createContext("user"), user: null });
    await expect(caller.contact.submit({ name: "A", email: "adresse-invalide", message: "court" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("bloque toute mutation de projet pour un non-administrateur avant une écriture", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.projects.create({
      slug: "projet-test",
      title: "Projet de test",
      shortDescription: "Description de test suffisamment longue.",
      description: "Description détaillée de test suffisamment longue pour valider le contrat.",
      technologies: ["TypeScript"],
      projectUrl: null,
      githubUrl: null,
      coverImageUrl: null,
      coverImageKey: null,
      isPublished: false,
      isFeatured: false,
      displayOrder: 0,
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejette les entrées invalides des formulaires de profil, projet et article", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.portfolio.updateProfile({
      fullName: "A", headline: "Titre", bio: "Biographie suffisante pour atteindre la règle de validation.", email: "invalide",
      phone: null, location: null, linkedinUrl: null, githubUrl: null, photoUrl: null, photoKey: null, availability: null,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.projects.create({
      slug: "Invalide", title: "Projet", shortDescription: "Résumé assez long.", description: "Description assez longue pour passer la longueur mais pas le slug.",
      technologies: ["Python"], projectUrl: null, githubUrl: null, coverImageUrl: null, coverImageKey: null, isPublished: false, isFeatured: false, displayOrder: 0,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.blog.create({
      slug: "article-test", title: "Un article", excerpt: "Extrait de test suffisamment long.", content: "trop court", tags: ["DevOps"], coverImageUrl: null, isPublished: false,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("retire les balises et URL non sûres avant publication d’un article", () => {
    const cleaned = sanitizeRichText('<p>Contenu <strong>utile</strong><script>alert(1)</script><a href="javascript:alert(1)">lien</a></p>');
    expect(cleaned).toContain("<strong>utile</strong>");
    expect(cleaned).not.toContain("script");
    expect(cleaned).not.toContain("javascript:");
  });
});
