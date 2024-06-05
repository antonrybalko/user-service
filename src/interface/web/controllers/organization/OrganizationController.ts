import { Response } from 'express';
import { Service, Inject } from 'typedi';
import { OrganizationService } from 'application/usecase/organization/OrganizationService';
import { CreateOrganizationDto } from 'application/usecase/organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from 'application/usecase/organization/UpdateOrganizationDto';
import BaseController from '../shared/BaseController';
import { RequestInterface } from 'interface/web/middleware/RequestInterface';
import { OrganizationDto } from './OrganizationDto';

@Service()
export class OrganizationController extends BaseController {
  @Inject()
  private organizationService: OrganizationService;

  public async createOrganization(
    req: RequestInterface,
    res: Response,
  ): Promise<Response> {
    try {
      const { guid } = await this.getTokenPayload(req);
      const organizationData = new CreateOrganizationDto(req.body);
      const organization = await this.organizationService.createOrganization(
        guid,
        organizationData,
      );
      return res
        .status(201)
        .json(OrganizationDto.fromDomainEntity(organization));
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  public async updateOrganization(
    req: RequestInterface,
    res: Response,
  ): Promise<Response> {
    try {
      const { guid } = await this.getTokenPayload(req);
      const organizationGuid = req.params.guid;
      const organizationData = new UpdateOrganizationDto(req.body);
      const organization =
        await this.organizationService.updateUserOrganization(
          guid,
          organizationGuid,
          organizationData,
        );
      return res
        .status(200)
        .json(OrganizationDto.fromDomainEntity(organization));
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
