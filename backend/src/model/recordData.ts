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
  triggeredSensors: number;

  @Column()
  activeSensors: number;

  @Column()
  alertLevel: Alertlevel;

  @Column()
  lowThresh : number;

  @Column()
  highThresh : number;

  @ManyToOne(() => City, (city) => city.records)
  city: City;
}
