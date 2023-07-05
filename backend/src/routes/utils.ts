import jwt from "jsonwebtoken";
import { AppDataSource } from "../dataSource";
import { User } from "../model/user";

/*
The verifyToken function check the validity of the token and if 
it is valid return the user info
*/
export default function verifyToken(req: any, res: any, next: any) {
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
      return res.status(401).json({ message: "Invalid email or password" });
    }
    //Return the user info through the request
    req.user = user;
    next();
  });
}
