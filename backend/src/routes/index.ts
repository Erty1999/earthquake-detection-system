import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../dataSource";
import { User } from "../model/user";
import { Router } from "express";

import verifyToken from "./utils";

const router = Router();

router.get("/", async (req, res, next) => {
  res.json({ message: "hello" });
});

router.post("/login", async function (req, res, next) {
  //Data is fetched from the request body
  const { email, pwd } = req.body;

  //Check required data existence
  if (!email || !pwd) {
    return res
      .status(400)
      .json({ message: "Missing required user information" });
  }

  const userRepository = AppDataSource.getRepository(User);

  //Check if the user email exists
  const user = await userRepository.findOne({ where: [{ email }] });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  //Check if the passwords match
  const isMatch = await bcrypt.compare(pwd, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  //Session token creation
  const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });

  res.json({ token });
});

router.post("/register", async (req, res, next) => {
  let error = false;

  //Data is fetched from the request body
  const {
    firstName,
    lastName,
    birthday,
    email,
    telNumber,
    telegramUserID,
    pwd,
  } = req.body;

  //Check required data existence
  if (!email || !pwd || !firstName || !lastName || !birthday) {
    return res
      .status(400)
      .json({ message: "Missing required user information" });
  }
  
  const userRepository = AppDataSource.getRepository(User);

  //Check if the new user alredy exists
  const existingUser = await userRepository.findOne({ where: [{ email }] });
  if (existingUser) {
    return res.status(409).json({ message: "Email already used" });
  }

  //Password hashing
  const hashedPassword = await bcrypt.hash(pwd, 10);

  //Create New User (not Admin as default)
  const admin = false;
  const user = userRepository.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    phoneNumber: telNumber,
    telegramID: telegramUserID,
    isAdmin: admin,
  });

  await userRepository.save(user).catch((e) => {
    error = true;
  });

  //Check if the save was successful
  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }


  res.status(200).json({ message: "User created correctly" });
});

router.get("/me", verifyToken, async (req, res) => {
  /*Recover user info through the request by 
    the execution of the verifyToken function*/
  let user = (req as any).user;
  res.json(user);
});

export default router;
