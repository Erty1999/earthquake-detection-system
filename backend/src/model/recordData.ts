import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { iotThing } from "./iotThing";

@Entity()
export class recordData {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => iotThing, (iotThing) => iotThing.records, { eager: true })
  iotThing: iotThing;

  @Column()
  value: number;

  @Column()
  timestamp: Date;

  @Index()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
