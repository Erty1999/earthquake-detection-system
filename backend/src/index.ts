import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import "reflect-metadata";

import "express-async-errors";
import router from "./routes";
import { AppDataSource } from "./dataSource";

async function main() {
  await AppDataSource.initialize();
  const app = express();

  app.use(cors());

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // TODO: get from env
  app.use(cookieParser("SECRET"));

  // logger
  app.use(morgan("dev"));

  // safety
  app.use(helmet());

  app.use("/uploads", express.static("uploads"));

  // routes
  app.use(router);

  // port
  const port = 3100;

  app.listen(port, () => {
    console.log("Started on port " + port);
  });
}

main();
