import { Router } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await db
      .select()
      .from(testimonialsTable)
      .orderBy(sql`${testimonialsTable.createdAt} desc`);
    res.json(testimonials);
  } catch (err) {
    req.log.error({ err }, "Failed to list testimonials");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
