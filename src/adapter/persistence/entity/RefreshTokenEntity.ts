import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RefreshToken } from 'entity/RefreshToken';
import { UserEntity } from './UserEntity';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  token: string;

  @Column()
  @Index()
  userGuid: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userGuid', referencedColumnName: 'guid' })
  user: UserEntity;

  /**
   * Converts the database entity to a domain entity
   * @returns RefreshToken domain entity
   */
  public toDomainEntity(): RefreshToken {
    return new RefreshToken(
      this.id,
      this.userGuid,
      this.token,
      this.expiresAt,
      this.createdAt,
    );
  }
}
