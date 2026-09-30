import express from "express";
import multer from "multer";
import { scanCropDisease } from "../controllers/diagnosticsController.js";
import { requireAuth } from "../middleware/auth.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.use(requireAuth);

router.post("/scan", upload.single("image"), scanCropDisease);

export default router;
