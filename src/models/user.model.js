import { pool } from "../database/db.js";

export const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT id FROM users WHERE username = $1", [
    username,
  ]);

  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

export const createUser = async (username, email, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
    [username, email, passwordHash],
  );

  return result.rows[0];
};

export const findUserCredentialsByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, password, email FROM users WHERE email = $1",
    [email],
  );

  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, email, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0];
};
