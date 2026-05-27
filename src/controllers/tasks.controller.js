import {
  findTasksByUser,
  findTasksByUserAndComplete,
  countTasksByUser,
  countTasksByUserAndComplete,
  createTask,
  findTaskByIdAndUser,
  deleteTaskByIdAndUser,
  updateTaskByIdAndUser,
  updateTaskCompleteByIdAndUser,
} from "../models/task.model.js";
import { getPagination } from "../utils/pagination.js";
import { parseCompleteFilter } from "../utils/parseCompleteFilter.js";
export const getTasks = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { page, limit, complete } = req.query;

    const pagination = getPagination(page, limit);

    if (pagination.error) {
      return res.status(400).json({
        message: pagination.error,
      });
    }

    const { pageNumber, limitNumber, offset } = pagination;

    const completeFilter = parseCompleteFilter(complete);

    if (completeFilter.error) {
      return res.status(400).json({
        message: completeFilter.error,
      });
    }

    const { hasFilter, completeValue } = completeFilter;

    let tasks;
    let totalTasks;

    if (hasFilter) {
      tasks = await findTasksByUserAndComplete(
        userId,
        completeValue,
        limitNumber,
        offset,
      );

      totalTasks = await countTasksByUserAndComplete(userId, completeValue);
    } else {
      tasks = await findTasksByUser(userId, limitNumber, offset);

      totalTasks = await countTasksByUser(userId);
    }

    const totalPages = Math.ceil(totalTasks / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    return res.status(200).json({
      tasks,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        offset,
        totalTasks,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};

export const createTasks = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id: userId } = req.user;

    const task = await createTask(title, description, userId);

    return res.status(201).json({
      message: "tarea creada correctamente",
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};
export const getTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const task = await findTaskByIdAndUser(taskId, userId);

    if (!task) {
      return res.status(404).json({
        message: "tarea no encontrada",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const { id } = req.params;

    const { id: userId } = req.user;

    const tasksDelete = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2  RETURNING *",
      [id, userId],
    );

    if (tasksDelete.rowCount === 0) {
      return res.status(404).json({
        message: "tarea no encontrada",
      });
    }

    return res.status(200).json({
      message: "tarea eliminada correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};
export const updateTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { title, description } = req.body;

    const tasksUpdate = await pool.query(
      "UPDATE tasks SET title = $1, description = $2  WHERE id = $3 AND  user_id = $4 RETURNING * ",
      [title, description, id, userId],
    );

    if (tasksUpdate.rowCount === 0) {
      return res.status(404).json({
        message: "tarea no encontrada",
      });
    }

    return res.json(tasksUpdate.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};

export const taskComplete = async (req, res) => {
  try {
    const { id: idTasks } = req.params;
    const { id: userId } = req.user;
    const { complete } = req.body;

    const statusTasks = await pool.query(
      "UPDATE tasks SET complete = $1  WHERE id = $2 AND user_id = $3 RETURNING * ",
      [complete, idTasks, userId],
    );

    if (statusTasks.rows.length === 0) {
      return res.status(404).json({
        message: "tarea no encontrada",
      });
    }

    return res.status(200).json({
      message: "tarea actualizada",
      updateTask: statusTasks.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};
