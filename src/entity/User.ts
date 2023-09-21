import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserStatus {
  REGISTERED = 0,
  ACTIVE = 1,
  DELETED = 2,
  BLOCKED = 3,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  oauthProvider: string;

  @Column({ nullable: true })
  vkId: string;

  @Column({ nullable: true })
  googleId: string;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Column('boolean', { default: false })
  isVendor: boolean;

  @Column({
    type: 'int',
    default: UserStatus.REGISTERED,
  })
  status: UserStatus;

  public isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  public isBlocked(): boolean {
    return this.status === UserStatus.BLOCKED;
  }

  public isDeleted(): boolean {
    return this.status === UserStatus.DELETED;
  }
}
