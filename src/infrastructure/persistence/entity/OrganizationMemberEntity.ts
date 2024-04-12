import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { OrganizationEntity } from './OrganizationEntity';
import { UserEntity } from './UserEntity';
import { OrganizationMember } from 'domain/entity/OrganizationMember';

@Unique('organization_member_user_organization', [
  'userGuid',
  'organizationGuid',
])
@Entity('organization_member')
export class OrganizationMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column({ type: 'uuid' })
  userGuid: string;

  @ManyToOne(() => UserEntity, (user) => user.organizationMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({ type: 'uuid' })
  organizationGuid: string;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.organizationMembers,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  organization: OrganizationEntity;

  @Column({ default: false })
  isOrgAdmin: boolean;

  public toDomainEntity(): OrganizationMember {
    return new OrganizationMember(
      this.userGuid,
      this.organizationGuid,
      this.isOrgAdmin,
    );
  }
}
