import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { City } from "./city";

enum iotThingType {
  sensor = 'sensor',
  led = 'led',
  display = 'display',
  buzzer = 'buzzer'
}
@Entity()
export class iotThing {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  thingType: iotThingType;

  @Column()
  lastHandshake: Date;

  @Column()
  shadowPrivateKey: string;

  @Column()
  shadowCertificate: string;

  @Column()
  shadowClientID: string;

  @Column()
  shadowEndpoint: string;

  @ManyToOne(() => City, (city) => city.iotThings)
  city: City;
}
