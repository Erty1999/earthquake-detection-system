import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import "reflect-metadata";

import "express-async-errors";
import router from "./routes";
import { config } from "dotenv";
import {
  recoverJWT,
  recoverIotDevices,
  startConnections,
  sendRecords,
} from "./utils";
import { Device } from "./Device";

export let iotDevices: Array<Device>;
let jwt = "";
let records: Array<{
  deviceID: string;
  cityId: string;
  isActive: boolean;
  triggerNumber: number;
}>;

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

  //config dotenv
  config();

  // port
  const port = process.env.PORT;

  app.listen(port, () => {
    console.log("Started on port " + port);
  });

  //Recover JWT for backens calls
  jwt = await recoverJWT();

  //Recover the list of sensors from the backend
  iotDevices = await recoverIotDevices(jwt);

  //Start all the connections
  await startConnections(iotDevices);

  //Every 5 seconds send surveys data to the backend
  while (true) {
    //Await 5 seconds
    await new Promise((r) => setTimeout(r, 5000));
    //Store all records
    records = [];
    for (let device of iotDevices) {
      //Add record
      records.push({
        deviceID: device.deviceID,
        cityId: device.cityID,
        isActive: device.isActive,
        triggerNumber: device.triggerNumber,
      });
      //Reset values
      device.isActive = false;
      device.triggerNumber = 0;
    }
    //Send the record to the BE
    if (records.length != 0) {
      await sendRecords(records, jwt);
    }
  }
}

main();
