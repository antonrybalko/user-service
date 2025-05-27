import { AppDataSource } from 'adapter/persistence/data-source';
import { UserEntity } from 'adapter/persistence/entity/UserEntity';
import { OrganizationEntity } from 'adapter/persistence/entity/OrganizationEntity';
import { OrganizationMemberEntity } from 'adapter/persistence/entity/OrganizationMemberEntity';

interface CreateOrganizationMemberParams {
  user: UserEntity;
  organization: OrganizationEntity;
  isOrgAdmin?: boolean;
}

export const createOrganizationMember = async ({
  user,
  organization,
  isOrgAdmin = false,
}: CreateOrganizationMemberParams): Promise<OrganizationMemberEntity> => {
  const organizationMemberRepository = AppDataSource.getRepository(
    OrganizationMemberEntity,
  );

  const organizationMember = organizationMemberRepository.create({
    user,
    organization,
    isOrgAdmin,
  });

  return organizationMemberRepository.save(organizationMember);
};
