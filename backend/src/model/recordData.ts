import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { City } from "./city";

@Entity()
export class recordData {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  activeSensors: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => City, (city) => city.records)
  city: City;
}
