import { pool } from "../database/db.js";

export const findTasksByUser = async (userId, limit, offset) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    [userId, limit, offset],
  );

  return result.rows;
};

export const findTasksByUserAndComplete = async (
  userId,
  complete,
  limit,
  offset,
) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 AND complete = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4",
    [userId, complete, limit, offset],
  );

  return result.rows;
};

export const countTasksByUser = async (userId) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
    [userId],
  );

  return Number(result.rows[0].count);
};

export const countTasksByUserAndComplete = async (userId, complete) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND complete = $2",
    [userId, complete],
  );

  return Number(result.rows[0].count);
};

export const createTask = async (title, description, userId) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, description, userId],
  );

  return result.rows[0];
};

export const findTaskByIdAndUser = async (taskId, userId) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [taskId, userId],
  );

  return result.rows[0];
};

export const deleteTaskByIdAndUser = async (taskId, userId) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
    [taskId, userId],
  );

  return result.rows[0];
};

export const updateTaskByIdAndUser = async (
  taskId,
  userId,
  title,
  description,
) => {
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
    [title, description, taskId, userId],
  );

  return result.rows[0];
};

export const updateTaskCompleteByIdAndUser = async (
  taskId,
  userId,
  complete,
) => {
  const result = await pool.query(
    "UPDATE tasks SET complete = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [complete, taskId, userId],
  );

  return result.rows[0];
};
