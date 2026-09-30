import express from "express";
import { syncAuthSession } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/sync", requireAuth, syncAuthSession);

export default router;
