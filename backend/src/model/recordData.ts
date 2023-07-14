import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { City } from "./city";

enum Alertlevel {
  none = "none",
  low = "low",
  high = "high",
}

@Entity()
export class recordData {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  activeSensors: number;

  @Column()
  totalSensors: number;

  @Column()
  alertLevel: Alertlevel;

  @ManyToOne(() => City, (city) => city.records)
  city: City;
}
