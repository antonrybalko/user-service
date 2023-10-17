import { Container } from 'typedi';
import { LoggerService } from './core/service/LoggerService';
import { ValidatorService } from './core/api/service/ValidatorService';
import { SanitizerService } from './core/api/service/SanitizerService';

Container.set('LoggerInterface', Container.get(LoggerService));
Container.set('ValidatorInterface', Container.get(ValidatorService));
Container.set('SanitizerInterface', Container.get(SanitizerService));
