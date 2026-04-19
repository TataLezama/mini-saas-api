import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { validateToken } from "../utils";
import { UserModel } from "../database/models/user.model";

export const adminMiddleware = async (
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

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(401).json({ error: 'User does not have permission' });
            return;
        }

        req.body.user = decoded;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}