import jwt from "jsonwebtoken";
import { AppDataSource } from "../dataSource";
import { User } from "../model/user";
import axios from "axios";
import { iotThing } from "../model/iotThing";

/*
The verifyToken function check the validity of the token and if 
it is valid return the user info
*/
export function verifyToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];

  //Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  //Check the token validity
  jwt.verify(token, "secret", async (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    //Recover the user informations
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: [{ id: decoded.id }],
      relations: ["avatar"],
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //Return the user info through the request (except the password)
    delete (user as any).password;
    req.user = user;
    next();
  });
}

/*
The verifyToken function check the validity of the token and if 
it is valid check if it's an Admin, returing the user info
*/
export function verifyTokenAdmin(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];

  //Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  //Check the token validity
  jwt.verify(token, "secret", async (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    //Recover the user informations
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: [{ id: decoded.id }],
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //Check if it is an Admin
    if (!user.isAdmin) {
      return res.status(401).json({
        message: "Unauthorized: only admins can execute this operation",
      });
    }

    //Return the user info through the request (except the password)
    delete (user as any).password;
    req.user = user;
    next();
  });
}

export async function addETLdevice(id: string) {
  let response;
  let error;

  //Recover the info of the device from the db
  const iotRepository = AppDataSource.getRepository(iotThing);

  const iotDevice = await iotRepository
    .findOne({
      where: { id: id as any },
      relations: ["city", "shadowPrivateKey", "shadowCertificate", "shadowCA"],
      select: [
        "id",
        "name",
        "city",
        "shadowPrivateKey",
        "shadowCertificate",
        "shadowCA",
        "shadowClientID",
        "shadowEndpoint",
      ],
    })
    .catch((e) => {
      console.log(e);
    });

  //Format data
  (iotDevice as any).city = iotDevice?.city?.id;

  //Send a post request to add the device to the ETL
  await axios
    .post(
      process.env.ETL_BASE_URL + "/iotDevice",
      {
        id: iotDevice?.id,
        name: iotDevice?.name,
        city: iotDevice?.city,
        shadowPrivateKey: iotDevice?.shadowPrivateKey,
        shadowCertificate: iotDevice?.shadowCertificate,
        shadowCA: iotDevice?.shadowCA,
        shadowClientID: iotDevice?.shadowClientID,
        shadowEndpoint: iotDevice?.shadowEndpoint,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      response = true;
    })
    .catch((e) => {
      response = false;
      console.log(e);
    });

  return response;
}

export async function deleteETLdevice(id: string) {
  let response;
  let error;

  await axios
    .delete(process.env.ETL_BASE_URL + "/iotDevice/" + id, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      response = true;
    })
    .catch((e) => {
      response = false;
      console.log(e);
    });
  if (error) {
    return error;
  }
  return response;
}
