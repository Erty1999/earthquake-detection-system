import { Router } from "express";
import { iotDevices } from "..";
import { Device } from "../Device";
import { stat } from "fs";

const router = Router();

router.post("/iotDevice", async (req, res, next) => {
  //Data is fetched from the request body
  const {
    id,
    name,
    city,
    shadowPrivateKey,
    shadowCertificate,
    shadowCA,
    shadowClientID,
    shadowEndpoint,
  } = req.body;
  //Check if all the fields exist
  if (
    !id ||
    !name ||
    !city ||
    !shadowPrivateKey ||
    !shadowCertificate ||
    !shadowCA ||
    !shadowClientID ||
    !shadowEndpoint
  ) {
    return res
      .status(400)
      .json({ message: "Missing required device information (pdm)" });
  }

  //Create the new istance
  const device = new Device({
    deviceID: id,
    shadowName: name,
    cityID: city,
    rowPrivateKey: shadowPrivateKey.data,
    rowClientCert: shadowCertificate.data,
    rowCaCert: shadowCA.data,
    clientId: shadowClientID,
    endpoint: shadowEndpoint,
  });

  //Add the device to the main list
  iotDevices.push(device);

  //Start device connection
  device.connect();

  //Push the device in the main list
  res.send(true);
});

router.delete("/iotDevice/:id", async (req, res, next) => {
  const id = req.params.id as any;

  //Recover item to disconect and delete
  const device = iotDevices.filter((device) => device.deviceID === id);

  //If no device has this id
  if (device.length === 0) {
    return res.status(404).json({ message: "Device not found (pdm)" });
  }

  //Disconnect the device
  device.at(0)?.disconnect();

  //Update the device list
  iotDevices.splice(
    iotDevices.findIndex((device) => device.deviceID === id),
    1
  );

  res.send(true);
});

router.put("/iotDevice/:id", async (req, res, next) => {
  //Data is fetched from the request body
  const { status } = req.body;
  const id = req.params.id as any;

  //Recover device
  const device = iotDevices.filter((device) => device.deviceID === id);

  //If no device has this id
  if (device.length === 0) {
    return res.status(404).json({ message: "Device not found (pdm)" });
  }

  //Disconnect the device
  device.at(0)?.updateStatus(status);

  res.send(true);
});

export default router;
