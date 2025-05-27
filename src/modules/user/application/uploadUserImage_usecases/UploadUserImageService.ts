import { Inject, Service } from 'typedi';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { StorageService } from 'infrastructure/cloud/StorageService';
import { UserImageRepository } from '../../infrastructure/UserImageRepository';
import { UserImage } from '../../domain/UserImage';

const jpegOptions = { quality: 100, mozjpeg: true };

@Service()
export class UploadUserImageService {
  @Inject()
  private storageService: StorageService;

  @Inject()
  private userImageRepository: UserImageRepository;

  async uploadUserImage(userGuid: string, file: Buffer): Promise<UserImage> {
    const { guid, fullUrl, mediumUrl, smallUrl } = await this.updateImage(
      userGuid,
      file,
    );

    await this.removeExistingImage(userGuid);

    const image = await this.userImageRepository.saveImageUrls(
      userGuid,
      fullUrl,
      mediumUrl,
      smallUrl,
      guid,
    );
    return image;
  }

  private composeImageUrl(
    userGuid: string,
    imageGuid: string,
    size: 'full' | 'medium' | 'small',
  ): string {
    return `images/user/${userGuid}/${imageGuid}/${size}.jpg`;
  }

  private async removeExistingImage(userGuid: string): Promise<void> {
    const existingImage =
      await this.userImageRepository.findImageByUserGuid(userGuid);
    if (!existingImage) {
      return;
    }
    await this.storageService.deleteFile(
      this.composeImageUrl(userGuid, existingImage.guid, 'full'),
    );
    await this.storageService.deleteFile(
      this.composeImageUrl(userGuid, existingImage.guid, 'medium'),
    );
    await this.storageService.deleteFile(
      this.composeImageUrl(userGuid, existingImage.guid, 'small'),
    );
    await this.userImageRepository.removeImageUrlsByGuid(existingImage.guid);
  }

  async updateImage(
    userGuid: string,
    file: Buffer,
  ): Promise<Pick<UserImage, 'guid' | 'fullUrl' | 'mediumUrl' | 'smallUrl'>> {
    const imageGuid = uuid();

    // Resize images
    const fullImageBuffer = await sharp(file.buffer)
      .resize(800, 800)
      .jpeg(jpegOptions)
      .toBuffer();

    const mediumImageBuffer = await sharp(file.buffer)
      .resize(100, 100)
      .jpeg(jpegOptions)
      .toBuffer();

    const smallImageBuffer = await sharp(file.buffer)
      .resize(50, 50)
      .jpeg(jpegOptions)
      .toBuffer();

    // Upload images to S3
    const fullUrl = await this.storageService.uploadFile(
      this.composeImageUrl(userGuid, imageGuid, 'full'),
      fullImageBuffer,
      'image/jpeg',
    );
    const mediumUrl = await this.storageService.uploadFile(
      this.composeImageUrl(userGuid, imageGuid, 'medium'),
      mediumImageBuffer,
      'image/jpeg',
    );
    const smallUrl = await this.storageService.uploadFile(
      this.composeImageUrl(userGuid, imageGuid, 'small'),
      smallImageBuffer,
      'image/jpeg',
    );

    return {
      guid: imageGuid,
      fullUrl,
      mediumUrl,
      smallUrl,
    };
  }
}
