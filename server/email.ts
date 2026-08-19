import { ENV } from "./_core/env";

type ContactEmail = {
  recipient: string;
  senderName: string;
  visitorName: string;
  visitorEmail: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendContactEmail(input: ContactEmail): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY is missing.");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio de Lionel <onboarding@resend.dev>",
      to: [input.recipient],
      reply_to: input.visitorEmail,
      subject: `Nouveau message portfolio — ${input.visitorName}`,
      text: `Bonjour ${input.senderName},\n\nVous avez reçu un nouveau message depuis votre portfolio.\n\nDe : ${input.visitorName} <${input.visitorEmail}>\n\n${input.message}`,
      html: `<p>Bonjour ${escapeHtml(input.senderName)},</p><p>Vous avez reçu un nouveau message depuis votre portfolio.</p><p><strong>De :</strong> ${escapeHtml(input.visitorName)} &lt;${escapeHtml(input.visitorEmail)}&gt;</p><blockquote>${escapeHtml(input.message).replaceAll("\n", "<br />")}</blockquote>`,
    }),
  });

  if (!response.ok) {
    console.warn(`[Email] Resend rejected contact notification (${response.status}).`);
    return false;
  }

  return true;
}
