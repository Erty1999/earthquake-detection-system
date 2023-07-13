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
import { Sensor } from "./sensor";
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

  @Column()
  shadowPrivateKey: string;

  @Column()
  shadowCertificate: string;

  @Column()
  shadowClientID: string;

  @Column()
  shadowEndpoint: string;

  @OneToMany(() => Subscription, (subscription) => subscription.city, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  subscriptions: Subscription[];

  @ManyToMany(() => User, (user) => user.cities)
  @JoinTable()
  users: User[];

  @OneToMany(() => Sensor, (sensor) => sensor.city, {
    cascade: true,
    eager: true,
    onDelete: "SET NULL",
  })
  sensors: Sensor[];

  @OneToMany(() => recordData, (recordData) => recordData.city, {
    cascade: true,
    onDelete: "CASCADE",
    eager: true,
  })
  records: recordData[];
}
