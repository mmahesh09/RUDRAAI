import { Router, Request, Response } from "express";
import { getEventTypeId, fetchCalSlots } from "../lib/calcom";
import logger from "../lib/logger";

const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

export const calRouter = Router();

// GET /api/cal/slots?startTime=ISO&endTime=ISO
// Returns real availability from Cal.com — API key is backend-only
calRouter.get("/slots", async (req: Request, res: Response) => {
  if (!process.env.CALCOM_API_KEY) {
    return res.status(503).json({ error: "Cal.com not configured" });
  }

  const { startTime, endTime } = req.query;
  if (!startTime || !endTime) {
    return res.status(400).json({ error: "startTime and endTime are required" });
  }

  const start = String(startTime);
  const end = String(endTime);

  if (!ISO_8601.test(start) || !ISO_8601.test(end)) {
    return res.status(400).json({ error: "startTime and endTime must be ISO-8601 strings" });
  }

  try {
    const eventTypeId = await getEventTypeId();
    if (!eventTypeId) {
      return res.status(404).json({ error: "Event type not found — check CALCOM_EVENT_SLUG" });
    }

    const data = await fetchCalSlots(start, end, eventTypeId);
    return res.json(data);
  } catch (error) {
    logger.error({ err: (error as Error).message }, "Cal.com slots error");
    return res.status(500).json({ error: "Failed to fetch available slots" });
  }
});
