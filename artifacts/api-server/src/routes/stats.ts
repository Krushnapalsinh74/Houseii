import { Router } from "express";
import { db, propertiesTable, projectsTable, inquiriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [
      totalPropertiesResult,
      totalProjectsResult,
      recentInquiriesResult,
      categoryCounts,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(propertiesTable),
      db.select({ count: sql<number>`count(*)` }).from(projectsTable),
      db.select({ count: sql<number>`count(*)` }).from(inquiriesTable),
      db
        .select({
          category: propertiesTable.category,
          count: sql<number>`count(*)`,
        })
        .from(propertiesTable)
        .groupBy(propertiesTable.category),
    ]);

    res.json({
      totalProperties: Math.max(Number(totalPropertiesResult[0]?.count ?? 0), 1000),
      happyClients: 500,
      totalProjects: Math.max(Number(totalProjectsResult[0]?.count ?? 0), 100),
      developerPartners: 50,
      propertiesByCategory: categoryCounts.map((r) => ({
        category: r.category,
        count: Number(r.count),
      })),
      recentInquiries: Number(recentInquiriesResult[0]?.count ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get platform stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
