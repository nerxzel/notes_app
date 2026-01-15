import { Router } from "express";
import noteController from "../controllers/note.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import noteSchema from "../validators/note.schema.js";

const router = Router();

router.get("/", noteController.findAll);
router.put("/", validateRequest(noteSchema), noteController.upsert);
router.delete("/:id", noteController.softDelete);

export default router