import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { User } from "./user";
import { Subscription } from "./subscription";
import { iotThing } from "./iotThing";
import { recordData } from "./recordData";

@Entity()
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

  @ManyToMany(() => User, (user) => user.cities)
  @JoinTable()
  users: User[];

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
