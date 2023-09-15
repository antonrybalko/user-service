import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    guid: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({nullable: true, unique: true})
    phoneNumber: string;

    @Column({nullable: true, unique: true})
    email: string;

    @Column({nullable: true})
    oauthProvider: string;

    @Column({nullable: true})
    vkId: string;

    @Column({nullable: true})
    googleId: string;
}