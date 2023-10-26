import { Container } from 'typedi';
import { LoggerService } from './core/service/LoggerService';
import { ValidatorService } from './api/core/service/ValidatorService';
import { SanitizerService } from './api/core/service/SanitizerService';
import {RegistrationRepository} from "./persistence/repository/RegistrationRepository";

Container.set('LoggerInterface', Container.get(LoggerService));
Container.set('ValidatorInterface', Container.get(ValidatorService));
Container.set('SanitizerInterface', Container.get(SanitizerService));
Container.set('RegistrationRepositoryInterface', Container.get(RegistrationRepository));