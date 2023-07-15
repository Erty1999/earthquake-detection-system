import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";

import { User } from "./user";
import { Subscription } from "./subscription";
import { iotThing } from "./iotThing";
import { recordData } from "./recordData";

@Entity()
@Unique(["name", "state"])
export class City {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column()
  state: string;

  @Column()
  lowThresh: number;

  @Column()
  highThresh: number;

  @OneToMany(() => Subscription, (subscription) => subscription.city, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  subscriptions: Subscription[];

  @OneToMany(() => iotThing, (iotThing) => iotThing.city, {
    cascade: true,
    eager: true,
    onDelete: "SET NULL",
  })
  iotThings: iotThing[];

  @OneToMany(() => recordData, (recordData) => recordData.city, {
    cascade: true,
    onDelete: "CASCADE",
    eager: true,
  })
  records: recordData[];
}
