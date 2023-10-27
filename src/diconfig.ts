import { Container } from 'typedi';
import { LoggerService } from './shared/service/LoggerService';
import { ValidatorService } from './shared/service/ValidatorService';
import { SanitizerService } from './shared/service/SanitizerService';
import {RegistrationRepository} from "./persistence/repository/RegistrationRepository";

Container.set('LoggerInterface', Container.get(LoggerService));
Container.set('ValidatorInterface', Container.get(ValidatorService));
Container.set('SanitizerInterface', Container.get(SanitizerService));
Container.set('RegistrationRepositoryInterface', Container.get(RegistrationRepository));