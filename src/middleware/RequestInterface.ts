import { Request as ExpressRequest } from 'express';

export type AuthUser = {
  guid: string;
  username: string;
};

export interface RequestInterface extends ExpressRequest {
  user?: any;
}
