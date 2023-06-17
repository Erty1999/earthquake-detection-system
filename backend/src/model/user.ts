import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

//Guardare tipi 
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @Column()
  email: number;

  @Column()
  isPublished: boolean;
}
