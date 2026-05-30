import { Router } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { CreateInquiryBody } from "@workspace/api-zod";

const router = Router();

router.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await db
      .select()
      .from(inquiriesTable)
      .orderBy(sql`${inquiriesTable.createdAt} desc`);
    res.json(inquiries);
  } catch (err) {
    req.log.error({ err }, "Failed to list inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/inquiries", async (req, res) => {
  try {
    const body = CreateInquiryBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid body" });
      return;
    }
    const [inquiry] = await db
      .insert(inquiriesTable)
      .values({ ...body.data, status: "new" })
      .returning();
    res.status(201).json(inquiry);
  } catch (err) {
    req.log.error({ err }, "Failed to create inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
