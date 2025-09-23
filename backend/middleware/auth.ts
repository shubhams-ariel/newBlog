import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

export interface AuthRequest extends Request {
  user?: {
      username: string; id: string; role: string 
};
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const secret = process.env.JWT_SECRET || "secret123";
    const decoded = jwt.verify(token, secret) as { id: string; role: string, username: string; };
    req.user = { id: decoded.id, username: decoded.username,role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ msg: "No user in request" });
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Admins only" });
  next();
};
