import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../dataSource";
import { User } from "../model/user";
import { Router } from "express";

import { verifyToken, verifyTokenAdmin } from "./utils";
import { upload } from "./mediaUpload";
import { City } from "../model/city";
import { uploadFile } from "./fileUpload";
import { Subscription } from "../model/subscription";
import { recordData } from "../model/recordData";
import { iotThing } from "../model/iotThing";

const router = Router();

router.get("/", async (req, res, next) => {
  res.json({ message: "easter egg" });
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

router.put("/users/:id", verifyToken, async (req, res, next) => {
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
});

//Images upload
router.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  const imageUrl = `http://localhost:3100/${file?.path}`;
  res.send({ message: "File uploaded successfully", imageUrl });
});

//Admit admin to create new users
router.post("/admin/createUser", verifyTokenAdmin, async (req, res, next) => {
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
  delete (user as any).password;
  res.send(user);
});

//Admit admin to see all the users
router.get("/admin/users", verifyTokenAdmin, async (req, res, next) => {
  let error = false;

  const userRepository = AppDataSource.getRepository(User);

  const userList = await userRepository
    .find({
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "birthday",
        "telNumber",
        "telegramUserID",
        "isAdmin",
        "avatar",
      ],
    })
    .catch((e) => {
      error = true;
    });

  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.send(userList);
});

//Admit admin to create new city
router.post("/admin/createCity", verifyTokenAdmin, async (req, res, next) => {
  let error = false;

  //Data is fetched from the request body
  const { name, region, state, lowThresh, highThresh } = req.body;

  //Check required data existence
  if (!name || !region || !state || !lowThresh || !highThresh) {
    return res.status(400).json({ message: "Missing required information" });
  }

  const cityRepository = AppDataSource.getRepository(City);

  //Check if the new city alredy exists (can't exist 2 cities with the same name in the same state)
  const existingUser = await cityRepository.findOne({
    where: [{ name, state }],
  });
  if (existingUser) {
    return res.status(409).json({ message: "City already stored" });
  }

  //Create New City (not Admin as default)
  const admin = false;
  const city = cityRepository.create({
    name: name,
    region: region,
    state: state,
    lowThresh: lowThresh,
    highThresh: highThresh,
  });

  await cityRepository.save(city).catch((e) => {
    error = true;
  });

  //Check if the save was successful
  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.send(city);
});

//Admit admin to update city
router.put(
  "/admin/updateCity/:id",
  verifyTokenAdmin,
  async (req, res, next) => {
    const id = req.params.id as any;
    let error = false;
    let city;

    const cityRepository = AppDataSource.getRepository(City);

    try {
      city = await cityRepository.findOne({ where: [{ id }] }).catch();
    } catch {
      city = null;
    }

    //If no city has the requested id
    if (!city) {
      return res.status(404).send("City not found");
    }

    //Data is fetched from the request body
    const { name, region, state, lowThresh, highThresh } = req.body;

    //Check if the new value of the city alredy exists (can't exist 2 cities with the same name in the same state)
    const existingCity = await cityRepository.findOne({
      where: [{ name, state }],
    });
    if (existingCity && existingCity.id != id) {
      return res.status(409).json({ message: "City already stored" });
    }

    //Update City
    city.name = name ?? city.name;
    city.region = region ?? city.region;
    city.state = state ?? city.state;
    city.lowThresh = lowThresh ?? city.lowThresh;
    city.highThresh = highThresh ?? city.highThresh;

    //Save updates
    await cityRepository.save(city);

    //Return updated user
    res.send(city);
  }
);

//City removing
router.delete("/admin/deleteCity/:id", verifyToken, async (req, res, next) => {
  const id = req.params.id as any;
  console.log(id, "ciao");
  let city;

  //Check if the city exists
  const cityRepository = AppDataSource.getRepository(City);

  try {
    city = await cityRepository.findOne({ where: [{ id }] });
  } catch {
    city = null;
  }
  if (!city) {
    return res.status(404).json({ message: "No city founded" });
  }

  //Implementing manual cascade delete
  const subRepository = AppDataSource.getRepository(Subscription);
  const recordRepository = AppDataSource.getRepository(recordData);
  const iotRepository = AppDataSource.getRepository(iotThing);

  //Delete Subs
  await subRepository
    .createQueryBuilder("subscription")
    .delete()
    .from(Subscription)
    .where("city = :id", { id: id })
    .execute();

  //Delete Records
  await recordRepository
    .createQueryBuilder("recordData")
    .delete()
    .from(recordData)
    .where("city = :id", { id: id })
    .execute();

  //Set Null related iotThings
  await recordRepository
    .createQueryBuilder("iotThing")
    .update(iotThing)
    .set({ city: () => null as any })
    .where("city = :id", { id: id })
    .execute();

  //Delete City
  await cityRepository
    .createQueryBuilder("cityDelete")
    .delete()
    .from(City)
    .where("id = :id", { id: id })
    .execute();

  res.send(true);
});

//Admit admin to see all the cities with relative relations
router.get("/admin/cities", verifyTokenAdmin, async (req, res, next) => {
  let error = false;

  const cityRepository = AppDataSource.getRepository(City);

  const cityList = await cityRepository.find().catch((e) => {
    error = true;
  });

  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  //Retrieve the last update of every city
  const recordRepository = AppDataSource.getRepository(recordData);
  for (let city of cityList as City[]) {
    const cityID = city.id;
    const lastUpdate = await recordRepository
      .createQueryBuilder("recordData")
      .where("recordData.city = :cityID", { cityID })
      .orderBy("recordData.createdAt", "DESC")
      .getOne();
    (city as any).lastUpdate = lastUpdate;
  }

  res.send(cityList);
});

//Return all the cities without relative records and subscriptions
router.get("/cities", verifyToken, async (req, res, next) => {
  let error = false;

  const cityRepository = AppDataSource.getRepository(City);

  const cityList = await cityRepository
    .find({
      select: [
        "id",
        "name",
        "region",
        "state",
        "lowThresh",
        "highThresh",
        "iotThings",
      ],
    })
    .catch((e) => {
      error = true;
    });

  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  //Retrieve the last update of every city
  const recordRepository = AppDataSource.getRepository(recordData);
  for (let city of cityList as City[]) {
    const cityID = city.id;
    const lastUpdate = await recordRepository
      .createQueryBuilder("recordData")
      .where("recordData.city = :cityID", { cityID })
      .orderBy("recordData.createdAt", "DESC")
      .getOne();
    (city as any).lastUpdate = lastUpdate;
  }

  res.send(cityList);
});

//Images upload
router.post(
  "/admin/uploadFile",
  verifyTokenAdmin,
  uploadFile.single("file"),
  async (req, res) => {
    console.log(req.file);
    const file = req.file;
    const path = file?.path;
    res.send(path);
  }
);

router.post("/subscription/:id", verifyToken, async (req, res, next) => {
  const reqUser = (req as any).user;
  const id = req.params.id as any;
  let user;
  let city;

  //Retrieve user
  const userRepository = AppDataSource.getRepository(User);

  try {
    user = await userRepository
      .findOne({ where: [{ id: (reqUser as any).id }] })
      .catch();
  } catch {
    user = null;
  }

  if (!user) {
    return res.status(500).send("Internal server error");
  }

  //Retrieve City
  const cityRepository = AppDataSource.getRepository(City);

  try {
    city = await cityRepository.findOne({ where: [{ id }] }).catch();
  } catch {
    city = null;
  }

  //If no city has the requested id
  if (!city) {
    return res.status(404).send("City not found");
  }

  //Create new subscription
  const subsRepository = AppDataSource.getRepository(Subscription);
  const sub = subsRepository.create({
    user: user,
    city: city,
  });

  //Check if the save was successful
  if (!sub) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  //Save updates
  await subsRepository.save(sub);

  res.send(true);
});

router.get("/subscription/:id", verifyToken, async (req, res, next) => {
  const id = req.params.id as any;
  let sub;

  //Get subscription
  const subsRepository = AppDataSource.getRepository(Subscription);
  try {
    sub = await subsRepository.findOne({ where: [{ id }] , relations: ['city']});
  } catch {
    sub = null;
  }
  //Check if the save was successful
  if (!sub) {
    return res.status(404).json({ message: "No subscrition Founded" });
  }

  res.send(sub);
});

router.get("/isSubscribed/:id", verifyToken, async (req, res, next) => {
  const reqUser = (req as any).user;
  const id = req.params.id as any;
  let sub;

  //Check if it is subscribed
  const subsRepository = AppDataSource.getRepository(Subscription);
  try {
    sub = await subsRepository
      .findOne({ where: [{ city: { id }, user: { id: reqUser.id } }] })
      .catch();
  } catch {
    sub = null;
  }

  //If there is no subscription
  if (!sub) {
    return res.send(false);
  }

  res.send(true);
});

router.delete("/subscription/:id", verifyToken, async (req, res, next) => {
  const reqUser = (req as any).user;
  const id = req.params.id as any;
  let sub;

  //Check if subscription exists
  const subsRepository = AppDataSource.getRepository(Subscription);
  try {
    sub = await subsRepository.findOne({
      where: [{ city: { id }, user: { id: reqUser.id } }],
    });
  } catch {
    sub = null;
  }

  //Check if there was this specific subscription
  if (!sub) {
    return res.status(404).json({ message: "No subscription founded" });
  }

  //Delete Subscription
  await subsRepository.remove(sub);

  res.send(true);
});

//Return a specific city informations
router.get("/city/:state/:name", verifyToken, async (req, res, next) => {
  let error = false;

  const cityName = req.params.name as any;
  const cityState = req.params.state as any;

  const cityRepository = AppDataSource.getRepository(City);

  const city = await cityRepository
    .findOne({
      where: { name: cityName, state: cityState },
    })
    .catch((e) => {
      error = true;
    });

  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  //Retrieve the last update of every city
  const recordRepository = AppDataSource.getRepository(recordData);

  const cityID = (city as any)?.id;
  const lastUpdate = await recordRepository
    .createQueryBuilder("recordData")
    .where("recordData.city = :cityID", { cityID })
    .orderBy("recordData.createdAt", "DESC")
    .getOne();
  (city as any).lastUpdate = lastUpdate;

  (city as any).subscriptions = city?.subscriptions.length;

  res.send(city);
});

//Return a alert changes data of last day
router.get(
  "/city/:state/:name/lastDayChartData",
  verifyToken,
  async (req, res, next) => {
    let error = false;

    const cityName = req.params.name as any;
    const cityState = req.params.state as any;

    const cityRepository = AppDataSource.getRepository(City);

    const city = await cityRepository
      .findOne({
        where: { name: cityName, state: cityState },
      })
      .catch((e) => {
        error = true;
      });

    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    //Retrieve the records of the last 24h (only high and low alert records)
    const recordRepository = AppDataSource.getRepository(recordData);

    const cityID = (city as any)?.id;
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const lastDay = await recordRepository
      .createQueryBuilder("recordData")
      .where("recordData.city = :cityID", { cityID })
      .andWhere("recordData.createdAt BETWEEN :yesterday AND :now", {
        yesterday,
        now,
      })
      .orderBy("recordData.createdAt", "ASC")
      .getMany();

    if (!lastDay?.at(0)) {
      return res.send("");
    }

    //Normalize the records showing only the points when the alert level change
    let lastDayGraphData = {} as any;
    //Take the first point
    lastDayGraphData[lastDay.at(0)!.createdAt.toISOString()] =
      lastDay.at(0)?.alertLevel;
    //Take all the alert level chenges
    let lastAlert = lastDay.at(0)?.alertLevel;
    for (let record of lastDay) {
      if (record.alertLevel === lastAlert) {
        continue;
      }
      lastAlert = record.alertLevel;
      lastDayGraphData[record.createdAt.toISOString()] = record.alertLevel;
    }
    //Take the last point
    lastDayGraphData[lastDay.at(lastDay.length - 1)!.createdAt.toISOString()] =
      lastDay.at(lastDay.length - 1)?.alertLevel;

    res.send(lastDayGraphData);
  }
);

router.get(
  "/city/:state/:name/lastMonthChartData",
  verifyToken,
  async (req, res, next) => {
    let error = false;

    const cityName = req.params.name as any;
    const cityState = req.params.state as any;

    const cityRepository = AppDataSource.getRepository(City);

    const city = await cityRepository
      .findOne({
        where: { name: cityName, state: cityState },
      })
      .catch((e) => {
        error = true;
      });

    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    //Retrieve the records of the last month (only high and low alert records)
    const recordRepository = AppDataSource.getRepository(recordData);

    const cityID = (city as any)?.id;
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastDay = await recordRepository
      .createQueryBuilder("recordData")
      .where("recordData.city = :cityID", { cityID })
      .andWhere("recordData.createdAt BETWEEN :lastMonth AND :now", {
        lastMonth,
        now,
      })
      .orderBy("recordData.createdAt", "ASC")
      .getMany();

    if (!lastDay?.at(0)) {
      return res.send("");
    }

    //Normalize the records showing only the points when the alert level change
    let lastDayGraphData = {} as any;
    //Take the first point
    lastDayGraphData[lastDay.at(0)!.createdAt.toISOString()] =
      lastDay.at(0)?.alertLevel;
    //Take all the alert level chenges
    let lastAlert = lastDay.at(0)?.alertLevel;
    for (let record of lastDay) {
      if (record.alertLevel === lastAlert) {
        continue;
      }
      lastAlert = record.alertLevel;
      lastDayGraphData[record.createdAt.toISOString()] = record.alertLevel;
    }
    //Take the last point
    lastDayGraphData[lastDay.at(lastDay.length - 1)!.createdAt.toISOString()] =
      lastDay.at(lastDay.length - 1)?.alertLevel;

    res.send(lastDayGraphData);
  }
);

router.post(
  "/city/:state/:name/recoverRecords",
  verifyToken,
  async (req, res, next) => {
    let error = false;

    const cityName = req.params.name as any;
    const cityState = req.params.state as any;

    //Data is fetched from the request body
    let { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      res
        .status(400)
        .json({ message: "Bad Request: insert all required fields" });
    }
    //Format type
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);

    const cityRepository = AppDataSource.getRepository(City);

    const city = await cityRepository
      .findOne({
        where: { name: cityName, state: cityState },
      })
      .catch((e) => {
        error = true;
      });

    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    //Retrieve the records of the last month
    const recordRepository = AppDataSource.getRepository(recordData);

    const cityID = (city as any)?.id;

    const records = await recordRepository
      .createQueryBuilder("recordData")
      .where("recordData.city = :cityID", { cityID })
      .andWhere("recordData.createdAt BETWEEN :fromDate AND :toDate", {
        fromDate,
        toDate,
      })
      .orderBy("recordData.createdAt", "ASC")
      .getMany();

    res.send(records);
  }
);

export default router;
