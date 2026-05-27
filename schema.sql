-- ============================================
-- Task Manager API - Database Schema
-- PostgreSQL
-- ============================================

-- Eliminar tablas si existen
-- OJO: esto borra las tablas y sus datos.
-- Úsalo solo en desarrollo si necesitas reiniciar la base de datos.

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- ============================================
-- Tabla: users
-- ============================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Tabla: tasks
-- ============================================

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  complete BOOLEAN DEFAULT FALSE,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ============================================
-- Índices recomendados
-- ============================================

CREATE INDEX idx_tasks_user_id ON tasks(user_id);

CREATE INDEX idx_tasks_user_created_at ON tasks(user_id, created_at DESC);

CREATE INDEX idx_tasks_user_complete ON tasks(user_id, complete);