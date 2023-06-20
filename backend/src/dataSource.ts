import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgress",
  password: "password",
  database: "esit",
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
});
