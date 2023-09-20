import { Request as ExpressRequest } from "express"

type AuthUser = {
    guid: string;
    username: string;
    email: string;
    isAdmin: boolean;
    isVendor: boolean;
    status: number;
}
export interface RequestInterface extends ExpressRequest {
    user?: any;
}