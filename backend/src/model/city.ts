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
  IoT_things: iotThing[];
}
