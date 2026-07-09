import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'ds-visualizer-jwt-secret-2024';

export interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();
  try {
    const payload = jwt.verify(header.slice(7), SECRET) as any;
    req.userId = payload.userId;
    req.username = payload.sub;
  } catch {}
  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.userId) return res.status(401).json({ code: 401, message: '请先登录' });
  next();
}

export function signToken(userId: number, username: string) {
  return jwt.sign({ userId, sub: username }, SECRET, { expiresIn: '24h' });
}
