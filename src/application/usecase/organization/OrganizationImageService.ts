import { Inject, Service } from 'typedi';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { StorageService } from 'infrastructure/cloud/StorageService';
import { OrganizationImage } from 'domain/entity/OrganizationImage';
import { OrganizationImageRepository } from 'infrastructure/persistence/repository/OrganizationImageRepository';

const jpegOptions = { quality: 100, mozjpeg: true };

@Service()
export class OrganizationImageService {
  @Inject()
  private storageService: StorageService;

  @Inject()
  private organizationImageRepository: OrganizationImageRepository;

  async uploadOrganizationImage(
    organizationGuid: string,
    file: Buffer,
  ): Promise<OrganizationImage> {
    const { guid, fullUrl, mediumUrl } = await this.updateImage(
      organizationGuid,
      file,
    );

    await this.removeExistingImage(organizationGuid);

    const image = await this.organizationImageRepository.saveImageUrls(
      organizationGuid,
      fullUrl,
      mediumUrl,
      guid,
    );
    return image;
  }

  private composeImageUrl(
    organizationGuid: string,
    imageGuid: string,
    size: 'full' | 'medium',
  ): string {
    return `images/organization/${organizationGuid}/${imageGuid}/${size}.jpg`;
  }

  private async removeExistingImage(organizationGuid: string): Promise<void> {
    const existingImage =
      await this.organizationImageRepository.findImageByOrganizationGuid(
        organizationGuid,
      );
    if (!existingImage) {
      return;
    }
    await this.storageService.deleteFile(
      this.composeImageUrl(organizationGuid, existingImage.guid, 'full'),
    );
    await this.storageService.deleteFile(
      this.composeImageUrl(organizationGuid, existingImage.guid, 'medium'),
    );
    await this.organizationImageRepository.removeImageUrlsByGuid(
      existingImage.guid,
    );
  }

  async updateImage(
    organizationGuid: string,
    file: Buffer,
  ): Promise<Pick<OrganizationImage, 'guid' | 'fullUrl' | 'mediumUrl'>> {
    const imageGuid = uuid();

    // Resize images
    const fullImageBuffer = await sharp(file.buffer)
      .resize({ width: 1000 })
      .jpeg(jpegOptions)
      .toBuffer();

    const mediumImageBuffer = await sharp(file.buffer)
      .resize({ width: 800 })
      .jpeg(jpegOptions)
      .toBuffer();

    // Upload images to S3
    const fullUrl = await this.storageService.uploadFile(
      this.composeImageUrl(organizationGuid, imageGuid, 'full'),
      fullImageBuffer,
      'image/jpeg',
    );
    const mediumUrl = await this.storageService.uploadFile(
      this.composeImageUrl(organizationGuid, imageGuid, 'medium'),
      mediumImageBuffer,
      'image/jpeg',
    );

    return {
      guid: imageGuid,
      fullUrl,
      mediumUrl,
    };
  }
}
