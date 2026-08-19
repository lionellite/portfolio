import { describe, expect, it } from "vitest";

describe("RESEND_API_KEY", () => {
  it("permits a lightweight authenticated request to Resend", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "La clé RESEND_API_KEY est requise pour les notifications e-mail.").toBeTruthy();

    const response = await fetch("https://api.resend.com/domains?limit=1", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.ok, `Resend a refusé la clé (${response.status}).`).toBe(true);
  }, 15000);
});
