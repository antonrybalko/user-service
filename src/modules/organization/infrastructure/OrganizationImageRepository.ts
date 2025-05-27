import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrganizationImageEntity } from '../entity/OrganizationImageEntity';
import { OrganizationImage } from 'domain/entity/OrganizationImage';
import { AppDataSource } from '../data-source';

@Service()
export class OrganizationImageRepository {
  private organizationImageRepository: Repository<OrganizationImageEntity>;

  constructor() {
    this.organizationImageRepository = AppDataSource.getRepository(
      OrganizationImageEntity,
    );
  }

  async findImageByOrganizationGuid(
    organizationGuid: string,
  ): Promise<OrganizationImage | undefined> {
    const image = await this.organizationImageRepository.findOne({
      where: { organizationGuid },
    });
    return image?.toDomainEntity();
  }

  async saveImageUrls(
    organizationGuid: string,
    fullUrl: string,
    mediumUrl: string,
    guid: string,
  ): Promise<OrganizationImageEntity> {
    const image = this.organizationImageRepository.create({
      guid,
      organizationGuid,
      fullUrl,
      mediumUrl,
    });
    return this.organizationImageRepository.save(image);
  }

  async removeImageUrlsByGuid(guid: string): Promise<void> {
    await this.organizationImageRepository.delete({ guid });
  }
}
