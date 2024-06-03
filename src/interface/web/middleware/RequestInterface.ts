import { Request as ExpressRequest } from 'express';
import { TokenPayload } from 'domain/valueObject/TokenPayload';

export interface RequestInterface extends ExpressRequest {
  tokenPayload?: TokenPayload;
}
