import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './UserEntity';
import {
  DefaultOrganizationStatus,
  Organization,
  OrganizationStatus,
} from 'entity/Organization';
import { OrganizationMemberEntity } from './OrganizationMemberEntity';

@Entity('organization')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column()
  title: string;

  @Column({ type: 'uuid' })
  cityGuid: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ type: 'uuid' })
  createdByUserGuid: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdByUserGuid' })
  createdByUser: UserEntity;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description?: string;

  @Column('bool', { default: false })
  published: boolean;

  @Column('int', { default: DefaultOrganizationStatus })
  status: OrganizationStatus;

  @OneToMany(
    () => OrganizationMemberEntity,
    (organizationMember) => organizationMember.organization,
  )
  organizationMembers: OrganizationMemberEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public toDomainEntity(): Organization {
    return new Organization(
      this.guid,
      this.title,
      this.cityGuid,
      this.phone,
      this.email,
      this.createdByUser?.toDomainEntity(),
      this.organizationMembers?.map((member) => member.toDomainEntity()),
      this.description,
      this.registrationNumber,
      this.published,
      this.status,
    );
  }
}
