import jwt from "jsonwebtoken";
import { AppDataSource } from "../dataSource";
import { User } from "../model/user";

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
      return res
        .status(401)
        .json({
          message: "Unauthorized: only admins can execute this operation",
        });
    }

    //Return the user info through the request (except the password)
    delete (user as any).password;
    req.user = user;
    next();
  });
}
