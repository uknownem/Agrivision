import express from "express";
import { generateAdvisory, getAdvisoryById, getAdvisoriesByField } from "../controllers/advisoryController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/generate", generateAdvisory);
router.get("/:id", getAdvisoryById);
router.get("/field/:fieldId", getAdvisoriesByField);

export default router;
