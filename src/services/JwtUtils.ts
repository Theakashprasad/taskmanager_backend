import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

// Extend the Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export class JwtUtils {
  // to generate token for sending to frontend
  static generateToken(val: any): string {
    const expiresIn = "1h";
    const secret = process.env.MY_SECRET as string;   
    console.log('token string', secret);
    
    const token = jwt.sign({ id: val._id }, secret, {
      expiresIn,
    });
    console.log(token);

    return token;
  }
  // middleware for checking if the jwt token is valid or not
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
    if (!token) return next(createError(401, "You are not authenticated!"));

    try {
      const decoded = jwt.verify(
        token,
        process.env.MY_SECRET as string
      ) as jwt.JwtPayload;
      req.userId = decoded.id;
      next();
    } catch (error) {
      next(createError(401, "Invalid token"));
    }
  }
}

function createError(status: number, message: string): Error {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}
