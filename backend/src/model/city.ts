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

  @OneToMany(() => Subscription, (subscription) => subscription.city)
  subscriptions: Subscription[];

  @ManyToMany(() => User, (user) => user.cities)
  @JoinTable()
  users: User[];

  @OneToMany(() => iotThing, (iotThing) => iotThing.city)
  IoT_things: iotThing[];
}
