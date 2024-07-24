import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';
import { UserImage } from 'domain/entity/UserImage';

@Entity({ name: 'user_image' })
export class UserImageEntity {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column({ type: 'uuid' })
  userGuid: string;

  @Column()
  fullUrl: string;

  @Column()
  mediumUrl: string;

  @Column()
  smallUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'userGuid' })
  user: UserEntity;

  toDomainEntity(): UserImage {
    return new UserImage(
      this.guid,
      this.userGuid,
      this.fullUrl,
      this.mediumUrl,
      this.smallUrl,
    );
  }
}
