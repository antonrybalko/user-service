import { Command } from 'commander';
import { Inject, Service } from 'typedi';
import BaseCommand from '../BaseCommand';
import { OrganizationService } from 'application/usecase/organization/OrganizationService';
import { UpdateOrganizationDto } from 'application/usecase/organization/UpdateOrganizationDto';

@Service()
export default class UpdateOrganizationCommand extends BaseCommand {
  @Inject()
  private organizationService: OrganizationService;

  async execute(
    program: Command,
    organizationGuid: string,
    options: UpdateOrganizationDto,
  ): Promise<void> {
    try {
      const {
        guid,
        title,
        cityGuid,
        phone,
        email,
        registrationNumber,
        status,
      } = await this.organizationService.updateOrganization(
        organizationGuid,
        new UpdateOrganizationDto(options),
      );
      // eslint-disable-next-line no-console
      console.log('Organization successfully updated:', {
        guid,
        title,
        cityGuid,
        phone,
        email,
        registrationNumber,
        status,
      });
    } catch (error) {
      this.handleError(program, error);
    }
  }
}
