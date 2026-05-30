import { Router } from "express";
import { db, propertiesTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, sql } from "drizzle-orm";
import {
  ListPropertiesQueryParams,
  CreatePropertyBody,
  GetPropertyParams,
  UpdatePropertyParams,
  UpdatePropertyBody,
  DeletePropertyParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/properties", async (req, res) => {
  try {
    const query = ListPropertiesQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query params" });
      return;
    }
    const { type, category, minPrice, maxPrice, location, bedrooms, featured, limit = 20, offset = 0, sort } = query.data;

    const conditions = [];
    if (type) conditions.push(eq(propertiesTable.type, type));
    if (category) conditions.push(eq(propertiesTable.category, category));
    if (minPrice !== undefined) conditions.push(gte(propertiesTable.price, minPrice));
    if (maxPrice !== undefined) conditions.push(lte(propertiesTable.price, maxPrice));
    if (location) conditions.push(ilike(propertiesTable.location, `%${location}%`));
    if (bedrooms !== undefined) conditions.push(eq(propertiesTable.bedrooms, bedrooms));
    if (featured !== undefined) conditions.push(eq(propertiesTable.featured, featured));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [properties, countResult] = await Promise.all([
      db.select().from(propertiesTable).where(where).limit(limit).offset(offset).orderBy(
        sort === "price_asc" ? propertiesTable.price :
        sort === "price_desc" ? sql`${propertiesTable.price} desc` :
        sql`${propertiesTable.createdAt} desc`
      ),
      db.select({ count: sql<number>`count(*)` }).from(propertiesTable).where(where),
    ]);

    res.json({ properties, total: Number(countResult[0]?.count ?? 0) });
  } catch (err) {
    req.log.error({ err }, "Failed to list properties");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/properties/featured", async (req, res) => {
  try {
    const properties = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.featured, true))
      .limit(8)
      .orderBy(sql`${propertiesTable.createdAt} desc`);
    res.json(properties);
  } catch (err) {
    req.log.error({ err }, "Failed to get featured properties");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/properties", async (req, res) => {
  try {
    const body = CreatePropertyBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid body" });
      return;
    }
    const [property] = await db.insert(propertiesTable).values(body.data).returning();
    res.status(201).json(property);
  } catch (err) {
    req.log.error({ err }, "Failed to create property");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/properties/:id", async (req, res) => {
  try {
    const params = GetPropertyParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [property] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, params.data.id));
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }
    res.json(property);
  } catch (err) {
    req.log.error({ err }, "Failed to get property");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/properties/:id", async (req, res) => {
  try {
    const params = UpdatePropertyParams.safeParse({ id: Number(req.params.id) });
    const body = UpdatePropertyBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const [property] = await db
      .update(propertiesTable)
      .set(body.data)
      .where(eq(propertiesTable.id, params.data.id))
      .returning();
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }
    res.json(property);
  } catch (err) {
    req.log.error({ err }, "Failed to update property");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/properties/:id", async (req, res) => {
  try {
    const params = DeletePropertyParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(propertiesTable).where(eq(propertiesTable.id, params.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete property");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
