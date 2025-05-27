import { Command } from 'commander';
import { Service, Inject } from 'typedi';
import BaseCommand from '../BaseCommand';
import { OrganizationService } from 'application/organization/OrganizationService';
import { CreateOrganizationDto } from 'application/organization/dto/CreateOrganizationDto';

@Service()
export default class CreateOrganizationCommand extends BaseCommand {
  @Inject()
  private organizationService: OrganizationService;

  async execute(
    program: Command,
    userGuid: string,
    options: CreateOrganizationDto,
  ): Promise<void> {
    try {
      const createOrganizationDto = new CreateOrganizationDto(options);
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
