import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "No Autorizado",
    });
  }

  jwt.verify(token, TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "No Autorizado",
      });
    }

    req.user = payload;
    next();
  });
};
