import { AppDataSource } from "../dataSource";
import { Router } from "express";

import { verifyToken, verifyTokenAdmin } from "./utils";
import { City } from "../model/city";
import { iotThing, State } from "../model/iotThing";

const iotThingRouter = Router();

//Admit admin to create new Iot Things
iotThingRouter.post(
  "/admin/createIotThing",
  verifyTokenAdmin,
  async (req, res, next) => {
    let error = false;

    //Data is fetched from the request body
    const {
      name,
      location,
      thingType,
      city,
      shadowPrivateKey,
      shadowCertificate,
      shadowCA,
      shadowEndpoint,
    } = req.body;

    //Check required data existence
    if (
      !name ||
      !location ||
      !thingType ||
      !city ||
      !shadowPrivateKey ||
      !shadowCertificate ||
      !shadowCA ||
      !shadowEndpoint
    ) {
      return res.status(400).json({ message: "Missing required information" });
    }

    //Check if the city exist adn recover it
    const cityRepository = AppDataSource.getRepository(City);
    const cityRecovered = await cityRepository.findOne({
      where: [{ id: city }],
    });
    if (!cityRecovered) {
      return res
        .status(404)
        .json({ message: "The city of the device doesn't exists" });
    }

    const iotRepository = AppDataSource.getRepository(iotThing);

    //Check if the new iot device alredy exists
    const existingDevice = await iotRepository.findOne({
      where: [{ city: cityRecovered as any, name }],
    });
    if (existingDevice) {
      return res.status(409).json({ message: "IoT device already stored" });
    }

    //Generate a random custom client id
    const shadowClientID =
      "clientID/" + Math.floor(Math.random() * Date.now()).toString(36);

    //Create New IoT Device
    const device = iotRepository.create({
      name: name,
      location: location,
      thingType: thingType,
      status: State.booting,
      shadowPrivateKey: shadowPrivateKey,
      shadowCertificate: shadowCertificate,
      shadowCA: shadowCA,
      shadowClientID: shadowClientID,
      shadowEndpoint: shadowEndpoint,
      city: city,
    });

    await iotRepository.save(device).catch((e) => {
      error = true;
    });

    //Check if the save was successful
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    //Retrieve the city information with the device
    device.city = cityRecovered;
    res.send(device);
  }
);

//Admit admin to see all the iot devices with relative city relation
iotThingRouter.get("/admin/iotThings", verifyTokenAdmin, async (req, res, next) => {
  let error = false;

  const iotRepository = AppDataSource.getRepository(iotThing);

  const iotList = await iotRepository
    .find({ relations: ["city"] })
    .catch((e) => {
      error = true;
    });

  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.send(iotList);
});

//Admit admin to delete iot device
iotThingRouter.delete(
  "/admin/deleteIotThing/:id",
  verifyToken,
  async (req, res, next) => {
    const id = req.params.id as any;
    let device;

    //Check if the iot device exists
    const iotRepository = AppDataSource.getRepository(iotThing);

    try {
      device = await iotRepository.findOne({ where: [{ id }] });
    } catch {
      device = null;
    }
    if (!device) {
      return res.status(404).json({ message: "No IoT Device founded" });
    }

    //Delete IoT Device
    await iotRepository
      .createQueryBuilder("iotDelete")
      .delete()
      .from(iotThing)
      .where("id = :id", { id: id })
      .execute();

    res.send(true);
  }
);

export default iotThingRouter;