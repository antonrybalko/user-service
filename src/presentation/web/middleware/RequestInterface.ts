import { Request as ExpressRequest } from 'express';
import { TokenPayload } from 'entity/TokenPayload';

export interface RequestInterface extends ExpressRequest {
  tokenPayload?: TokenPayload;
}
