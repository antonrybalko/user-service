import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { OrganizationEntity } from 'infrastructure/persistence/entity/OrganizationEntity';
import { OrganizationMemberEntity } from 'infrastructure/persistence/entity/OrganizationMemberEntity';

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
