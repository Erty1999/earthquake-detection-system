import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import "reflect-metadata";

import "express-async-errors";
import router from "./routes";

async function main() {
  const app = express();

  app.use(cors());

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // logger
  app.use(morgan("dev"));

  // safety
  app.use(helmet());

  // routes
  app.use(router);

  // port
  const port = 3300;

  app.listen(port, () => {
    console.log("Started on port " + port);
  });
}

main();
