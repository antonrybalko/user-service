import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrganizationEntity } from './OrganizationEntity';
import { OrganizationImage } from 'entity/OrganizationImage';

@Entity({ name: 'organization_image' })
export class OrganizationImageEntity {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column({ type: 'uuid' })
  organizationGuid: string;

  @Column()
  fullUrl: string;

  @Column()
  mediumUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => OrganizationEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationGuid' })
  organization: OrganizationEntity;

  toDomainEntity(): OrganizationImage {
    return new OrganizationImage(
      this.guid,
      this.organizationGuid,
      this.fullUrl,
      this.mediumUrl,
    );
  }
}
