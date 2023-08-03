import { DataSource } from "typeorm";
import { User } from "./model/user";
import { City } from "./model/city";
import { Subscription } from "./model/subscription";
import { iotThing } from "./model/iotThing";
import { recordData } from "./model/recordData";
import { Image } from "./model/image";
import { File } from "./model/file";

import { config } from "dotenv";
import bcrypt from "bcrypt";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
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

export async function createBaseUsers(dataSource: DataSource) {
  //Dotenv configuation (env variables)
  config();

  const userRepository = dataSource.getRepository(User);

  //first Admin account creation
  let alredyExist = await userRepository.findOne({
    where: [{ email: process.env.ADMIN_EMAIL }],
  });
  if (!alredyExist) {
    const hashedPassword = await bcrypt
      .hash(process.env.ADMIN_PWD as any, 10)
      .catch(() => {
        throw "add admin credential in the .env file";
      });
    const firstAdmin = userRepository.create({
      firstName: process.env.ADMIN_FN,
      lastName: process.env.ADMIN_LN,
      email: process.env.ADMIN_EMAIL,
      birthday: process.env.ADMIN_BIRTHDAY,
      password: hashedPassword,
      isAdmin: true,
    });
    await userRepository.save(firstAdmin).catch();
  }

  //etl account creation
  alredyExist = await userRepository.findOne({
    where: [{ email: process.env.ETL_EMAIL }],
  });
  if (!alredyExist) {
    const hashedPassword = await bcrypt
      .hash(process.env.ETL_PWD as any, 10)
      .catch(() => {
        throw "add etl credential in the .env file";
      });
    const etl = userRepository.create({
      firstName: process.env.ETL_FN,
      lastName: process.env.ETL_LN,
      email: process.env.ETL_EMAIL,
      birthday: process.env.ETL_BIRTHDAY,
      password: hashedPassword,
      isAdmin: true,
    });
    await userRepository.save(etl).catch();
  }

  //passive devices manager account creation
  alredyExist = await userRepository.findOne({
    where: [{ email: process.env.PDM_EMAIL }],
  });
  if (!alredyExist) {
    const hashedPassword = await bcrypt
      .hash(process.env.PDM_PWD as any, 10)
      .catch(() => {
        throw "add pdm credential in the .env file";
      });
    const pdm = userRepository.create({
      firstName: process.env.PDM_FN,
      lastName: process.env.PDM_LN,
      email: process.env.PDM_EMAIL,
      birthday: process.env.PDM_BIRTHDAY,
      password: hashedPassword,
      isAdmin: true,
    });
    await userRepository.save(pdm).catch();
  }
}
