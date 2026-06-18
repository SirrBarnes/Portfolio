import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { from, subject, message } = req.body;

  if (!from || !subject || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

  try {
    const formData = new URLSearchParams();
    formData.append("from", `Portfolio Contact Form <postmaster@${MAILGUN_DOMAIN}>`);
    formData.append("to", "Sergio Torres <torressergio1357@gmail.com>");
    formData.append("subject", `[Portfolio] ${subject}`);
    formData.append("text", `From: ${from}\n\n${message}`);

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Mailgun error:", errText);
      return res.status(502).json({ error: "Mailgun failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}