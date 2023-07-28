import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import "reflect-metadata";

import "express-async-errors";
import cityRouter from "./routes/city";
import fileRouter from "./routes/file";
import iotThingRouter from "./routes/iotThing";
import subRouter from "./routes/subscription";
import userRouter from "./routes/user";
import recordDataRouter from "./routes/recordData";
import { AppDataSource, createBaseUsers } from "./dataSource";

async function main() {
  await AppDataSource.initialize();
  await createBaseUsers(AppDataSource);
  const app = express();

  //Allow cors 
  app.use(cors());

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // logger
  app.use(morgan("dev"));

  // safety
  app.use(helmet());

  // routes
  app.use(cityRouter);
  app.use(fileRouter);
  app.use(iotThingRouter);
  app.use(subRouter);
  app.use(userRouter);
  app.use(recordDataRouter)

  // port
  const port = process.env.PORT;

  app.listen(port, () => {
    console.log("Started on port " + port);
  });
}

main();
