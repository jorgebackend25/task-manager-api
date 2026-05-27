import { Router } from "express";
import {
  getTasks,
  getTask,
  createTasks,
  deleteTasks,
  updateTasks,
  taskComplete,
} from "../controllers/tasks.controller.js";
import { authRequired } from "../middlewares/validatetoken.js";
import {
  taskSchema,
  completeTaskSchema,
  taskParamsSchema,
} from "../schemas/tasks.schema.js";
import { validateSchema } from "../middlewares/validate.schema.js";
import { validateParams } from "../middlewares/validateParams.js";
const router = Router();

router.get("/tasks", authRequired, getTasks);
router.get(
  "/tasks/:id",
  authRequired,
  validateParams(taskParamsSchema),
  getTask,
);
router.post("/tasks", authRequired, validateSchema(taskSchema), createTasks);
router.put(
  "/tasks/:id",
  authRequired,
  validateParams(taskParamsSchema),
  validateSchema(taskSchema),
  updateTasks,
);
router.patch(
  "/tasks/:id/status",
  authRequired,
  validateSchema(completeTaskSchema),
  taskComplete,
);
router.delete(
  "/tasks/:id",
  validateParams(taskParamsSchema),
  authRequired,
  deleteTasks,
);

export default router;
