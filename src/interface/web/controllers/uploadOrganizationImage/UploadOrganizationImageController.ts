import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import BaseController from '../shared/BaseController';
import { OrganizationImageService } from 'application/usecase/organization/OrganizationImageService';
import { OrganizationImageDto } from './OrganizationImageDto';

@Service()
export default class UploadOrganizationImageController extends BaseController {
  @Inject()
  private organizationImageService: OrganizationImageService;

  public async uploadOrganizationImage(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      if (req.headers['content-type'] !== 'image/jpeg') {
        return res.status(400).json({
          error: 'Invalid file. Please upload a JPEG file only.',
        });
      }

      const { guid: organizationGuid } = req.params;
      const file = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const organizationImage: OrganizationImageDto =
        await this.organizationImageService.uploadOrganizationImage(
          organizationGuid,
          file,
        );

      return res.status(200).json(organizationImage);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
