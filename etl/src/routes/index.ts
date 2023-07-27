import { Router } from "express";
import { iotDevices } from "..";
import { Device } from "../Device";

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
  console.log(req.body)
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
      .json({ message: "Missing required device information (etl)" });
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

  //Push the device in the main list
  res.send(true);
});

router.delete("/iotDevice/:id", async (req, res, next) => {
  const id = req.params.id as any;

  //Recover item to disconect and delete
  const device = iotDevices.filter((device) => device.deviceID === id);
  
  //If no device has this id
  if (device.length === 0) {
    return res.status(404).json({ message: "Device not found (etl)" });
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

export default router;
