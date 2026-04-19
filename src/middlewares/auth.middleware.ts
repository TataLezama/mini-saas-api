import { NextFunction, Request, Response } from "express";
import { validateToken, JwtPayload } from "../utils";
import { prisma } from "../configs";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    if (!authHeader.startsWith('Bearer ')){
        res.status(401).json({ error: 'Invalid Bearer token' });
        return;
    }
    try {
        const token = authHeader.split(' ')[1] || '';
        const decoded = validateToken(token);
        if (!decoded){
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const user = await prisma.user.findFirst({ where: { id: decoded.id } });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.body.user = decoded;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}