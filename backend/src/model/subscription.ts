import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm";
import { City } from "./city";
import { User } from "./user";

@Entity()
@Unique(["user", "city"])
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @ManyToOne(() => City, (city) => city.subscriptions)
  city: City;

  @Column({default: false})
  lowAlert: boolean;

  @Column({default: false})
  highAlert: boolean;

}
