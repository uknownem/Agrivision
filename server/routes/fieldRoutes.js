import express from "express";
import { getFields, getFieldById, createField, deleteField } from "../controllers/fieldController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getFields);
router.get("/:id", getFieldById);
router.post("/", createField);
router.delete("/:id", deleteField);

export default router;
