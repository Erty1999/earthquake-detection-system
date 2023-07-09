import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;
}

