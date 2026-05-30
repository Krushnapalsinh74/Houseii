import { Router } from "express";
import { db, usersTable, propertiesTable, projectsTable, inquiriesTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/requireAdmin";
import bcrypt from "bcryptjs";

const router = Router();

router.use(requireAdmin);

router.get("/admin/stats", async (req, res) => {
  try {
    const [usersCount, propertiesCount, projectsCount, inquiriesCount, featuredCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(usersTable),
      db.select({ count: sql<number>`count(*)` }).from(propertiesTable),
      db.select({ count: sql<number>`count(*)` }).from(projectsTable),
      db.select({ count: sql<number>`count(*)` }).from(inquiriesTable),
      db.select({ count: sql<number>`count(*)` }).from(propertiesTable).where(eq(propertiesTable.featured, true)),
    ]);
    res.json({
      totalUsers: Number(usersCount[0]?.count ?? 0),
      totalProperties: Number(propertiesCount[0]?.count ?? 0),
      totalProjects: Number(projectsCount[0]?.count ?? 0),
      totalInquiries: Number(inquiriesCount[0]?.count ?? 0),
      featuredProperties: Number(featuredCount[0]?.count ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Admin stats failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users", async (req, res) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        role: usersTable.role,
        isVerified: usersTable.isVerified,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));
    res.json(users);
  } catch (err) {
    req.log.error({ err }, "Admin list users failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { role, isVerified, name, phone, password } = req.body as { role?: string; isVerified?: boolean; name?: string; phone?: string; password?: string };
    const update: Record<string, unknown> = {};
    if (role !== undefined) update.role = role;
    if (isVerified !== undefined) update.isVerified = isVerified;
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (password !== undefined) update.passwordHash = await bcrypt.hash(password, 10);
    if (Object.keys(update).length === 0) { res.status(400).json({ error: "Nothing to update" }); return; }
    const [user] = await db.update(usersTable).set(update).where(eq(usersTable.id, id)).returning({
      id: usersTable.id, name: usersTable.name, email: usersTable.email,
      phone: usersTable.phone, role: usersTable.role, isVerified: usersTable.isVerified, createdAt: usersTable.createdAt,
    });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json(user);
  } catch (err) {
    req.log.error({ err }, "Admin update user failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(usersTable).where(eq(usersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Admin delete user failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users/:id/properties", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) { res.status(400).json({ error: "Invalid id" }); return; }
    const properties = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.userId, userId))
      .orderBy(desc(propertiesTable.createdAt));
    res.json(properties);
  } catch (err) {
    req.log.error({ err }, "Admin user properties failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/properties", async (req, res) => {
  try {
    const properties = await db
      .select()
      .from(propertiesTable)
      .orderBy(desc(propertiesTable.createdAt));
    res.json(properties);
  } catch (err) {
    req.log.error({ err }, "Admin list properties failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/properties/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { featured, status, title, description, price, priceUnit, location, type, category, bedrooms, bathrooms, area, builderName, possession, rera } = req.body as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    if (featured !== undefined) update.featured = featured;
    if (status !== undefined) update.status = status;
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (priceUnit !== undefined) update.priceUnit = priceUnit;
    if (location !== undefined) update.location = location;
    if (type !== undefined) update.type = type;
    if (category !== undefined) update.category = category;
    if (bedrooms !== undefined) update.bedrooms = bedrooms;
    if (bathrooms !== undefined) update.bathrooms = bathrooms;
    if (area !== undefined) update.area = area;
    if (builderName !== undefined) update.builderName = builderName;
    if (possession !== undefined) update.possession = possession;
    if (rera !== undefined) update.rera = rera;
    if (Object.keys(update).length === 0) { res.status(400).json({ error: "Nothing to update" }); return; }
    const [property] = await db.update(propertiesTable).set(update).where(eq(propertiesTable.id, id)).returning();
    if (!property) { res.status(404).json({ error: "Property not found" }); return; }
    res.json(property);
  } catch (err) {
    req.log.error({ err }, "Admin update property failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/properties/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(propertiesTable).where(eq(propertiesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Admin delete property failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/projects", async (req, res) => {
  try {
    const projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt));
    res.json(projects);
  } catch (err) {
    req.log.error({ err }, "Admin list projects failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/projects", async (req, res) => {
  try {
    const { name, description, builderName, location, status, type, minPrice, maxPrice, totalUnits, images, amenities, rera, possession, featured } = req.body as Record<string, unknown>;
    if (!name || !builderName || !location || !status || !type) {
      res.status(400).json({ error: "Missing required fields: name, builderName, location, status, type" });
      return;
    }
    const [project] = await db.insert(projectsTable).values({
      name: name as string,
      description: (description as string | undefined) ?? null,
      builderName: builderName as string,
      location: location as string,
      status: status as string,
      type: type as string,
      minPrice: (minPrice as number | undefined) ?? null,
      maxPrice: (maxPrice as number | undefined) ?? null,
      totalUnits: (totalUnits as number | undefined) ?? null,
      images: (images as string[] | undefined) ?? [],
      amenities: (amenities as string[] | undefined) ?? [],
      rera: (rera as string | undefined) ?? null,
      possession: (possession as string | undefined) ?? null,
      featured: (featured as boolean | undefined) ?? false,
    }).returning();
    res.status(201).json(project);
  } catch (err) {
    req.log.error({ err }, "Admin create project failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { name, description, builderName, location, status, type, minPrice, maxPrice, totalUnits, images, amenities, rera, possession, featured } = req.body as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (builderName !== undefined) update.builderName = builderName;
    if (location !== undefined) update.location = location;
    if (status !== undefined) update.status = status;
    if (type !== undefined) update.type = type;
    if (minPrice !== undefined) update.minPrice = minPrice;
    if (maxPrice !== undefined) update.maxPrice = maxPrice;
    if (totalUnits !== undefined) update.totalUnits = totalUnits;
    if (images !== undefined) update.images = images;
    if (amenities !== undefined) update.amenities = amenities;
    if (rera !== undefined) update.rera = rera;
    if (possession !== undefined) update.possession = possession;
    if (featured !== undefined) update.featured = featured;
    if (Object.keys(update).length === 0) { res.status(400).json({ error: "Nothing to update" }); return; }
    const [project] = await db.update(projectsTable).set(update).where(eq(projectsTable.id, id)).returning();
    if (!project) { res.status(404).json({ error: "Project not found" }); return; }
    res.json(project);
  } catch (err) {
    req.log.error({ err }, "Admin update project failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Admin delete project failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/inquiries", async (req, res) => {
  try {
    const inquiries = await db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.createdAt));
    res.json(inquiries);
  } catch (err) {
    req.log.error({ err }, "Admin list inquiries failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/inquiries/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { status } = req.body as { status?: string };
    if (!status) { res.status(400).json({ error: "Nothing to update" }); return; }
    const [inquiry] = await db.update(inquiriesTable).set({ status }).where(eq(inquiriesTable.id, id)).returning();
    if (!inquiry) { res.status(404).json({ error: "Inquiry not found" }); return; }
    res.json(inquiry);
  } catch (err) {
    req.log.error({ err }, "Admin update inquiry failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
