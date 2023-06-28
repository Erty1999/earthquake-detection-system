import { DataSource } from "typeorm";
import { User } from "./model/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "esit",
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});

