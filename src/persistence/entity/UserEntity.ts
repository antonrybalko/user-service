import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import User, { DefaultUserStatus, UserStatus } from '../../entity/User';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  phoneNumber?: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true })
  oauthProvider?: string;

  @Column({ nullable: true })
  vkId?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Column('boolean', { default: false })
  isVendor: boolean;

  @Column('int', { default: DefaultUserStatus })
  status: UserStatus;

  public toDomainEntity(): User {
    return new User(
      this.guid,
      this.username,
      this.isAdmin,
      this.isVendor,
      this.phoneNumber,
      this.email,
      this.oauthProvider,
      this.vkId,
      this.googleId,
      this.status,
    );
  }
}
