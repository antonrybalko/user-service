import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import BaseController from '../shared/BaseController';
import { UserImageDto } from './UserImageDto';
import { UploadUserImageService } from 'application/uploadUserImage/UploadUserImageService';

@Service()
export default class UploadUserImageController extends BaseController {
  @Inject()
  private uploadUserImageService: UploadUserImageService;

  public async uploadUserImage(req: Request, res: Response): Promise<Response> {
    try {
      if (
        req.headers['content-type'] !== 'image/jpeg' &&
        req.headers['content-type'] !== 'image/png'
      ) {
        return res.status(400).json({
          error: 'Invalid file. Please upload a JPEG or PNG file only.',
        });
      }

      const { guid: userGuid } = await this.getTokenPayload(req);
      const file = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userImage: UserImageDto =
        await this.uploadUserImageService.uploadUserImage(userGuid, file);

      return res.status(200).json(userImage);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
