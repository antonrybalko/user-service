import { NextFunction, Request, Response } from 'express';
import {UserService} from "../service/UserService";
import {RequestInterface} from "./RequestInterface";
import { Inject, Service } from 'typedi';
import { LoggerInterface } from '../interface/LoggerInterface';

@Service()
export class EnsureAdminUser {
    @Inject('LoggerInterface')
    private logger: LoggerInterface;

    async ensure(req: RequestInterface, res: Response, next: NextFunction) {
        try {
            const userGuid = req.user.guid;
            const userService = new UserService();
            const user = await userService.findByGuid(userGuid);

            if (user && user.isActive() && user.isAdmin) {
                next();
            } else {
                this.logger.error(`EnsureAdminUser failed for: ${userGuid}`);
                res.sendStatus(403);
            }
        } catch (error) {
            this.logger.error(error);
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}