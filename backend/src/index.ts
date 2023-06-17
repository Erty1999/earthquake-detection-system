import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import "reflect-metadata";

import "express-async-errors";
import router from "./routes";
import { AppDataSource } from "./dataSource";

async function main() {
  await AppDataSource.initialize();
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // TODO: get from env
  app.use(cookieParser("SECRET"));

  // logger
  app.use(morgan("dev"));

  // safety (se caga il cazzo brucialo in dev)
  app.use(helmet());

  // TODO: routes mettere in un altro file
  app.use(router);

  // TODO: get port from env
  const port = 3100;
  app.listen(port, () => {
    console.log("Started on port " + port);
  });
}

main();
