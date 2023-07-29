import { AppDataSource } from "../dataSource";
import { Router } from "express";

import { updateDevicesAlertLevel, verifyTokenAdmin } from "./utils";
import { City } from "../model/city";
import { iotThing, iotThingType, State } from "../model/iotThing";
import { recordData, Alertlevel } from "../model/recordData";
import { Not } from "typeorm";

const recordDataRouter = Router();

//Admit admin to create new Iot Things
recordDataRouter.post(
  "/recordData",
  verifyTokenAdmin,
  async (req, res, next) => {
    let error = false;
    let citiesList = [];

    //Data is fetched from the request body
    const { records } = req.body;

    //If there's no records just return true
    if (records?.length === 0) res.send(true);

    //IoT devices state updated
    const iotRepository = AppDataSource.getRepository(iotThing);
    for (let record of records) {
      //Recover the iot device
      const device = await iotRepository
        .findOne({
          where: [{ id: record?.deviceID }],
        })
        .catch((e) => console.log(e));
      if (!device) continue;

      //If the state change, update it
      if (device?.status != State.active && record?.isActive) {
        device.status = State.active;
        await iotRepository.save(device);
      } else if (device?.status != State.inactive && !record?.isActive) {
        device.status = State.inactive;
        await iotRepository.save(device);
      }

      //update the list of recorded cities
      if (!(citiesList as any).includes(record?.cityId)) {
        citiesList.push(record?.cityId);
      }
    }

    //If there's no valid record just return true
    if (citiesList?.length === 0) res.send(true);

    const cityRepository = AppDataSource.getRepository(City);
    const recordRepository = AppDataSource.getRepository(recordData);

    //Record Generation (one for city)
    for (let cityID of citiesList as any) {
      let triggeredSensors = 0;
      //Recover the city informations
      const city = await cityRepository
        .findOne({ where: [{ id: cityID as any }] })
        .catch((e) => console.log(e));
      if (!city) continue;

      //Recover all the records of every city
      const recordsCity = (records as Array<any>).filter(
        (r) => r.cityId === cityID
      );

      //Check for trigger events
      for (let record of recordsCity) {
        if (record?.triggerNumber > 0) triggeredSensors = triggeredSensors + 1;
      }

      //Calculate the alert level
      let alertLevel;
      if (triggeredSensors === 0) alertLevel = Alertlevel.pacific;
      else {
        const alertRatio = (triggeredSensors / recordsCity.length  ) * 100;

        if (alertRatio < city.lowThresh) {
          alertLevel = Alertlevel.pacific;
        } else if (alertRatio < city.highThresh) {
          alertLevel = Alertlevel.low;
        } else {
          alertLevel = Alertlevel.high;
        }
      }

      //RecordData creation and saving
      const date = Date.now();
      const recordData = recordRepository.create({
        createdAt: date as any,
        triggeredSensors: triggeredSensors,
        activeSensors: recordsCity.filter((r) => r.isActive).length,
        alertLevel: alertLevel,
        lowThresh: city.lowThresh,
        highThresh: city.highThresh,
        city: city,
      });
      await recordRepository.save(recordData).catch((e) => {
        console.log(e);
      });

      /*Send alert level to Passive devices manager in order to update 
      the passive device of relaative cities*/
      const passiveDevices = await iotRepository
        .find({
          where: [{ city: (city as any), thingType: Not(iotThingType.sensor) }],
        })
        .catch((e) => console.log(e));
      if (passiveDevices && passiveDevices.length !== 0) {
        for (let passiveDevice of passiveDevices) {
          updateDevicesAlertLevel(passiveDevice.id as any, alertLevel);
        }
      }

      //TODO: Notifications?

      //TODO : Telegram?
    }

    res.send(true);
  }
);

export default recordDataRouter;
