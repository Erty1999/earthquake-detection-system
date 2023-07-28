import { AppDataSource } from "../dataSource";
import { Router } from "express";

import { verifyTokenAdmin } from "./utils";
import { City } from "../model/city";
import { iotThing, iotThingType, State } from "../model/iotThing";

const recordDataRouter = Router();

//Admit admin to create new Iot Things
recordDataRouter.post(
  "/recordData",
  verifyTokenAdmin,
  async (req, res, next) => {
    let error = false;

    //Data is fetched from the request body
    const { records } = req.body;
    console.log(records);
    res.send(true);
  }
);

export default recordDataRouter;
