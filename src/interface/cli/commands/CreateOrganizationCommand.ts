import { Command } from 'commander';
import { Service, Container } from 'typedi';
import { OrganizationService } from '../../../application/usecase/organization/OrganizationService';
import BaseCommand from './BaseCommand';
import { CreateOrganizationDto } from 'application/usecase/organization/CreateOrganizationDto';

@Service()
export class CreateOrganizationCommand extends BaseCommand {
  private organizationService: OrganizationService;

  constructor() {
    super();
    this.organizationService = Container.get(OrganizationService);
  }

  async execute(
    program: Command,
    userGuid: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any,
  ): Promise<void> {
    try {
      const createOrganizationDto = new CreateOrganizationDto({
        title: options.title,
        cityGuid: options.cityGuid,
        phoneNumber: options.phoneNumber,
        email: options.email,
        registrationNumber: options.registrationNumber,
      });
      const organization = await this.organizationService.createOrganization(
        userGuid,
        createOrganizationDto,
      );
      // eslint-disable-next-line no-console
      console.log('Organization successfully created:', organization);
    } catch (error) {
      this.handleError(program, error);
    }
  }
}
