import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import { cookieOptions, clearCookieOptions } from "../config.js";
import {
  findUserByUsername,
  findUserByEmail,
  createUser,
  findUserCredentialsByEmail,
  findUserById,
} from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const usernameFound = await findUserByUsername(username);

    if (usernameFound) {
      return res.status(409).json({
        message: "username ya esta registrado",
      });
    }

    const emailFound = await findUserByEmail(email);

    if (emailFound) {
      return res.status(409).json({
        message: "El email ya está registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser(username, email, passwordHash);

    const token = await createAccessToken({ id: user.id });

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "usuario creado correctamente",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await findUserCredentialsByEmail(email);

    if (!userFound) {
      return res.status(401).json({
        message: "credenciales invalidas",
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "credenciales invalidas",
      });
    }

    const token = await createAccessToken({ id: userFound.id });

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      id: userFound.id,
      email: userFound.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const { id } = req.user;

    const userFound = await findUserById(id);

    if (!userFound) {
      return res.status(404).json({
        message: "no encontrado",
      });
    }

    return res.status(200).json({
      id: userFound.id,
      email: userFound.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error interno",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", clearCookieOptions);

  return res.status(200).json({
    message: "sesion cerrada correctamente",
  });
};
