import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { City } from "./city";

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  chipID: string;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => City, (city) => city.sensors)
  city: City;
}
