import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { Subscription } from "./subscription";
import { Image } from "./image";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  firstName: string;

  @Column()
  birthday: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telNumber: string;

  @Column({ nullable: true })
  telegramUserID: string;

  @Column()
  isAdmin: boolean;

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  subscriptions: Subscription[];

  @OneToOne(() => Image, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn()
  avatar: Image;
}
