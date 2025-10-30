import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";


export const allowRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role?.name;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ message: "Access denied. Insufficient role." });
      return;
    }

    next();
  };
};
