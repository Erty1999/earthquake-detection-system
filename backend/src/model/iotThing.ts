import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { City } from "./city";
import { recordData } from "./recordData";

enum iotThingType {
  SENSOR = "sensor",
  LED = "led",
  BUZZER = "buzzer",
  DISPLAY = "display",
}

@Entity()
export class iotThing {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  type: iotThingType;

  @ManyToOne(() => City, (city) => city.IoT_things)
  city: City;

  @OneToMany(() => recordData, (recordData) => recordData.iotThing)
  records: recordData[];
}
