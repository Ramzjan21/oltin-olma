import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    telegramId: number;
    isAdmin: boolean;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token topilmadi' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Yaroqsiz token' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, message: 'Ruxsat yo\'q. Faqat admin' });
  }
  next();
};

export const generateToken = (userId: number, telegramId: number, isAdmin: boolean = false) => {
  return jwt.sign(
    { id: userId, telegramId, isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );
};
