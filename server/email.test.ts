import { afterEach, describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "./email";

describe("sendContactEmail", () => {
  afterEach(() => vi.restoreAllMocks());

  it("envoie une notification structurée et sûre à Resend", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ id: "email_1" }), { status: 200 }));

    const sent = await sendContactEmail({
      recipient: "liolisena@gmail.com",
      senderName: "Lionel",
      visitorName: "Ada Lovelace",
      visitorEmail: "ada@example.com",
      message: "Bonjour <Lionel>",
    });

    expect(sent).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith("https://api.resend.com/emails", expect.objectContaining({ method: "POST" }));
    const payload = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body));
    expect(payload.to).toEqual(["liolisena@gmail.com"]);
    expect(payload.reply_to).toBe("ada@example.com");
    expect(payload.html).toContain("&lt;Lionel&gt;");
  });
});
