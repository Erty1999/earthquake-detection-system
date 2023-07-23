import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { City } from "./city";
import { File } from "./file";

enum iotThingType {
  sensor = "sensor",
  led = "led",
  display = "display",
  buzzer = "buzzer",
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
  lastHandshake: Date;

  @OneToOne(() => File, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn()
  shadowPrivateKey: File;

  @OneToOne(() => File, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn()
  shadowCertificate: File;

  @OneToOne(() => File, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn()
  shadowClientID: File;

  @Column()
  shadowEndpoint: string;

  @ManyToOne(() => City, (city) => city.iotThings, { nullable: true })
  city: City;
}
