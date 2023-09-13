import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("uuid")
    guid: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    email: string;
}