import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import propertiesRouter from "./properties";
import projectsRouter from "./projects";
import inquiriesRouter from "./inquiries";
import testimonialsRouter from "./testimonials";
import blogRouter from "./blog";
import statsRouter from "./stats";
import servicesRouter from "./services";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(propertiesRouter);
router.use(projectsRouter);
router.use(inquiriesRouter);
router.use(testimonialsRouter);
router.use(blogRouter);
router.use(statsRouter);
router.use(servicesRouter);
router.use(adminRouter);

export default router;
