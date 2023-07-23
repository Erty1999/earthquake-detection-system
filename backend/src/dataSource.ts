import { DataSource } from "typeorm";
import { User } from "./model/user";
import { City } from "./model/city";
import { Subscription } from "./model/subscription";
import { iotThing } from "./model/iotThing";
import { recordData } from "./model/recordData";
import { Image } from "./model/image";
import { File } from "./model/file"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "esit",
  synchronize: true,
  logging: true,
  entities: [User, City, Subscription, iotThing, recordData, Image, File],
  subscribers: [],
  migrations: [],
});
