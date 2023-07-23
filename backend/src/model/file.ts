import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: String;
}
