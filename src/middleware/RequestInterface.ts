import { Request as ExpressRequest } from 'express';

export type TokenPayload = {
  guid: string;
  username: string;
};

export interface RequestInterface extends ExpressRequest {
  tokenPayload?: TokenPayload;
}
