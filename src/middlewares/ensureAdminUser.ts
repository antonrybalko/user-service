import { NextFunction, Request, Response } from 'express';
import {UserService} from "../service/UserService";
import {Logger} from "tslog";
import {RequestInterface} from "./RequestInterface";

export async function ensureAdminUser(req: RequestInterface, res: Response, next: NextFunction) {
    try {
        const userGuid = req.user.guid; // assuming you put the guid in the JWT payload
        const userService = new UserService();
        const user = await userService.findByGuid(userGuid);

        if (user && user.isAdmin) {
            next();
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        const logger = new Logger();
        logger.error(error);
        res.status(500).json({ error: 'Unknown error' });
    }
}