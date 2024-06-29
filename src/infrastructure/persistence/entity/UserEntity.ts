import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User, DefaultUserStatus, UserStatus } from 'domain/entity/User';
import { OrganizationMemberEntity } from './OrganizationMemberEntity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  phone?: string;

  @Column()
  firstname: string;

  @Column({ nullable: true })
  lastname?: string;

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
  isVendor?: boolean;

  @Column('int', { default: DefaultUserStatus })
  status: UserStatus;

  @OneToMany(
    () => OrganizationMemberEntity,
    (organizationMember) => organizationMember.user,
  )
  organizationMembers: OrganizationMemberEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public toDomainEntity(): User {
    return new User(
      this.guid,
      this.username,
      this.isAdmin,
      this.isVendor ?? false,
      this.firstname,
      this.lastname,
      this.phone,
      this.email,
      this.oauthProvider,
      this.vkId,
      this.googleId,
      this.status,
    );
  }
}
