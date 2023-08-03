import axios from "axios";
import { Device } from "./Device";

export async function recoverJWT() {
  let jwt;
  //Credential existence check
  if (!process.env.ETL_EMAIL || !process.env.ETL_PWD) {
    throw "please insert the etl credential in the .env file";
  }
  //Try to connect to the db and recover the jwt
  while (!jwt) {
    await axios
      .post(process.env.BE_BASE_URL + "/login", {
        email: process.env.ETL_EMAIL,
        pwd: process.env.ETL_PWD,
      })
      .then((res) => {
        jwt = res?.data?.token;
      })
      .catch((error) => {});
    if (!jwt) {
      console.log("JWT recovery failed, retrying in 5 seconds");
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  return jwt;
}

export async function recoverIotDevices(jwt: string) {
  let iotDevices = [];
  let rawDevices;
  let error = true;

  while (error) {
    //Recover sensor devices from be
    await axios
      .get(process.env.BE_BASE_URL + "/sensors", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      })
      .then((res) => {
        rawDevices = res?.data;
        error = false;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //If there are no sensors
  if (!rawDevices) {
    return [];
  }

  for (let d of rawDevices as any) {
    //Create an instance for all the sensor
    const device = new Device({
      deviceID: d.id,
      shadowName: d.name,
      cityID: d.city,
      rowPrivateKey: d.shadowPrivateKey.data,
      rowClientCert: d.shadowCertificate.data,
      rowCaCert: d.shadowCA.data,
      clientId: d.shadowClientID,
      endpoint: d.shadowEndpoint,
    });
    //Add it to the list
    iotDevices.push(device);
  }

  return iotDevices;
}

export async function startConnections(deviceList: Array<Device>) {
  //If there are no sensors
  if (deviceList.length === 0) return;
  //Start all the connections
  for (let device of deviceList) {
    device.connect();
  }
}

//Send records to the be
export async function sendRecords(records: any, jwt: string) {
  await axios
    .post(
      process.env.BE_BASE_URL + "/recordData",
      { records: records },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      }
    )
    .catch((error) => {
      console.log("something went wrong sending the records, error: ");
      console.error(error);
    });
}
