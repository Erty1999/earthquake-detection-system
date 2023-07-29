import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { City } from "./city";
import { File } from "./file";

export enum iotThingType {
  sensor = "sensor",
  led = "led",
  display = "display",
  buzzer = "buzzer",
}

export enum State {
  active = "active",
  inactive = "inactive",
  booting = "booting"
}

@Entity()
export class iotThing {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  thingType: iotThingType;

  @Column()
  status: State;

  @OneToOne(() => File)
  @JoinColumn()
  shadowPrivateKey: File;

  @OneToOne(() => File)
  @JoinColumn()
  shadowCertificate: File;

  @ManyToOne(() => File)
  shadowCA: File;

  @Column()
  shadowClientID: string;

  @Column()
  shadowEndpoint: string;

  @ManyToOne(() => City, (city) => city.iotThings, { nullable: true })
  city: City;
}
