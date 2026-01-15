import { Router } from "express";
import noteController from "../controllers/note.controller.js"

const router = Router();

router.get("/", noteController.findAll);
router.put("/", noteController.upsert);

export default router