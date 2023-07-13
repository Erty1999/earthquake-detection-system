import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { City } from "./city";
import { User } from "./user";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions,)
  user: User;

  @ManyToOne(() => City, (city) => city.subscriptions)
  city: City;

  @Column({default: false})
  lowAlert: boolean;

  @Column({default: false})
  highAlert: boolean;

  @Column({default: false})
  sumUp: boolean;
}
