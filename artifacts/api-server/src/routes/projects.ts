import { Router } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { ListProjectsQueryParams, GetProjectParams } from "@workspace/api-zod";

const router = Router();

router.get("/projects", async (req, res) => {
  try {
    const query = ListProjectsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query params" });
      return;
    }
    const { status, type } = query.data;
    const conditions = [];
    if (status) conditions.push(eq(projectsTable.status, status));
    if (type) conditions.push(eq(projectsTable.type, type));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const projects = await db
      .select()
      .from(projectsTable)
      .where(where)
      .orderBy(sql`${projectsTable.createdAt} desc`);
    res.json(projects);
  } catch (err) {
    req.log.error({ err }, "Failed to list projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const params = GetProjectParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, params.data.id));
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (err) {
    req.log.error({ err }, "Failed to get project");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
