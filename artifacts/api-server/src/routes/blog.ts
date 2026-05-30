import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { ListBlogPostsQueryParams, GetBlogPostParams } from "@workspace/api-zod";

const router = Router();

router.get("/blog", async (req, res) => {
  try {
    const query = ListBlogPostsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query params" });
      return;
    }
    const { category, limit = 20 } = query.data;
    let posts;
    if (category) {
      posts = await db
        .select()
        .from(blogPostsTable)
        .where(eq(blogPostsTable.category, category))
        .limit(limit)
        .orderBy(sql`${blogPostsTable.publishedAt} desc`);
    } else {
      posts = await db
        .select()
        .from(blogPostsTable)
        .limit(limit)
        .orderBy(sql`${blogPostsTable.publishedAt} desc`);
    }
    res.json(posts);
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const params = GetBlogPostParams.safeParse({ slug: req.params.slug });
    if (!params.success) {
      res.status(400).json({ error: "Invalid slug" });
      return;
    }
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, params.data.slug));
    if (!post) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to get blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
