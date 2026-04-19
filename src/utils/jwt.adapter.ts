import jwt from 'jsonwebtoken';
import { envs } from '../configs';

export interface JwtPayload {
    id: string;
    email: string;
    role?: string;
}

export const generateToken = (payload: JwtPayload): string => {
    const secret = envs.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT its not configured');
    }

    return jwt.sign(payload, secret, { expiresIn: '4h' });
};

export const validateToken = (token: string): JwtPayload => {
    const secret = envs.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT its not configured');
    }

    return jwt.verify(token, secret) as JwtPayload;
};