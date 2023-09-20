import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {RequestInterface} from "./RequestInterface";

export function authenticateJWT(req: RequestInterface, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}