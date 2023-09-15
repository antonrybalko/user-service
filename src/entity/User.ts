import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    guid: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    email: string;
}