import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { UserImageEntity } from '../entity/UserImageEntity';
import { AppDataSource } from '../data-source';
import { UserImage } from 'domain/entity/UserImage';

@Service()
export class UserImageRepository {
  private userImageRepository: Repository<UserImageEntity>;

  constructor() {
    this.userImageRepository = AppDataSource.getRepository(UserImageEntity);
  }

  async saveImageUrls(
    userGuid: string,
    fullUrl: string,
    mediumUrl: string,
    smallUrl: string,
    imageGuid?: string,
  ): Promise<UserImage> {
    const userImage = new UserImageEntity();
    if (imageGuid) {
      userImage.guid = imageGuid;
    }
    userImage.userGuid = userGuid;
    userImage.fullUrl = fullUrl;
    userImage.mediumUrl = mediumUrl;
    userImage.smallUrl = smallUrl;

    const createdImage = await this.userImageRepository.save(userImage);
    return createdImage.toDomainEntity();
  }

  async removeImageUrlsByGuid(imageGuid: string): Promise<void> {
    await this.userImageRepository.delete({ guid: imageGuid });
  }

  async findImageByUserGuid(userGuid: string): Promise<UserImage | null> {
    const image = await this.userImageRepository.findOne({
      where: { userGuid },
    });
    return image?.toDomainEntity() ?? null;
  }
}
