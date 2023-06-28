import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

//Guardare tipi
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: number;

  @Column()
  telegramID: string;

  @Column()
  avatar: string;

  @Column()
  isAdmin: boolean;
}
