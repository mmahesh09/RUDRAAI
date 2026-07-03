import logger from "./logger";

export interface BookingSlackPayload {
  name: string;
  email: string;
  company: string;
  role?: string;
  timeSlot: string;
  goal: string;
  zoomLink: string | null;
}

export async function notifySlackBooking(data: BookingSlackPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return; // silently skip if not configured

  const zoomBlock = data.zoomLink
    ? `\n>🎥 *Zoom:* <${data.zoomLink}|Join Meeting>`
    : "\n>🎥 *Zoom:* _Will be sent within 1 hour_";

  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🗓️ New Automation Audit Booked!",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Name*\n${data.name}` },
          { type: "mrkdwn", text: `*Email*\n${data.email}` },
          { type: "mrkdwn", text: `*Company*\n${data.company || "—"}` },
          { type: "mrkdwn", text: `*Role*\n${data.role || "—"}` },
        ],
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*📅 Time Slot*\n${data.timeSlot}` },
          {
            type: "mrkdwn",
            text: `*🎥 Zoom Link*\n${data.zoomLink ? `<${data.zoomLink}|Join Meeting>` : "_Pending_"}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🎯 Automation Goal*\n>${data.goal.replace(/\n/g, "\n>")}`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `RudraAI Booking System • ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      logger.warn({ status: res.status, body: text }, "Slack notification failed");
    } else {
      logger.info({ name: data.name, timeSlot: data.timeSlot }, "Slack booking notification sent");
    }
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Slack notification error");
  }
}
