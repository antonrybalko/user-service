import { Container } from 'typedi';
import { LoggerService } from './service/LoggerService';

Container.set('LoggerInterface', Container.get(LoggerService));
