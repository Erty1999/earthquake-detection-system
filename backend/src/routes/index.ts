import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../dataSource";
import { User } from "../model/user";
import { Image } from "../model/image";
import { Router } from "express";

import verifyToken from "./utils";
import { upload } from "./mediaUpload";

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

  delete (user as any).password;
  res.json({ user, token });
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
    birthday: birthday,
    password: hashedPassword,
    telNumber: telNumber,
    telegramUserID: telegramUserID,
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

/*Recover user info through the request by 
    the execution of the verifyToken function*/
router.get("/me", verifyToken, async (req, res, next) => {
  let user = (req as any).user;
  res.json(user);
});

router.put(
  "/users/:id",
  verifyToken,
  async (req, res, next) => {
    const reqUser = (req as any).user;
    const id = req.params.id as any;
    let user;

    const userRepository = AppDataSource.getRepository(User);

    try {
      user = await userRepository.findOne({ where: [{ id }] }).catch();
    } catch {
      user = null;
    }

    //If no user has the requested id
    if (!user) {
      return res.status(404).send("User not found");
    }

    //If it is not an admin or the user itself return unauthorized
    if (!reqUser.isAdmin && reqUser.id != user.id) {
      return res.status(401).send("Unauthorized Operation");
    }

    //Data is fetched from the request body
    const {
      firstName,
      lastName,
      birthday,
      email,
      telNumber,
      telegramUserID,
      avatar,
      isAdmin,
      pwd,
    } = req.body;

    //Only admin can change the admin status of a user
    if (isAdmin && !reqUser.isAdmin) {
      return res.status(401).send("Unauthorized Operation");
    }

    //Check if the email is alredy in use
    const existingEmailUser = await userRepository.findOne({
      where: [{ email }],
    });
    if (existingEmailUser && id != existingEmailUser.id) {
      return res.status(409).json({ message: "Email already used" });
    }

    //Update User
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.email = email ?? user.email;
    user.birthday = birthday ?? user.birthday;
    user.telNumber = telNumber ?? user.telNumber;
    user.telegramUserID = telegramUserID ?? user.telegramUserID;
    user.avatar = avatar ?? user.avatar;
    user.isAdmin = isAdmin ?? user.isAdmin;

    if (pwd) {
      //Password hashing
      const hashedPassword = await bcrypt.hash(pwd, 10);
      user.password = hashedPassword;
    }

    //Save updates
    await userRepository.save(user);

    //Return updated user
    delete (user as any).password;
    res.send(user);
  },

  router.post("/upload", upload.single("image"), async (req, res) => {
    const file = req.file;
    const imageUrl = `http://localhost:3100/${file?.path}`;

    // Save imageUrl to the database using TypeORM
    const imageRepository = AppDataSource.getRepository(Image);
    const image = {} as Image;
    image.url = imageUrl;
    await imageRepository.save(image);

    res.send({ message: "File uploaded successfully", imageUrl });
  })
);

export default router;
