import { DataSource } from "typeorm";
import { User } from "./model/user";
import { City } from "./model/city";
import { Subscription } from "./model/subscription";
import { iotThing } from "./model/iotThing";
import { recordData } from "./model/recordData";
import { Image } from "./model/image";
import { File } from "./model/file";

import bcrypt from "bcrypt";

export let AppDataSource: DataSource;

export async function createDataSource() {
  const source = new DataSource({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT as any,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE as any,
    logging: process.env.TYPEORM_LOGGING as any,
    entities: [User, City, Subscription, iotThing, recordData, Image, File],
    subscribers: [],
    migrations: [],
  });
  AppDataSource = source;
  return source;
}

export async function createBaseUsers(dataSource: DataSource) {
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
