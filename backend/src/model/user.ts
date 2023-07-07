import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  firstName: string;

  @Column()
  birthday: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telNumber: string;

  @Column({ nullable: true })
  telegramUserID: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  isAdmin: boolean;
}
