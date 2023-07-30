import { AppDataSource } from "../dataSource";
import { Router } from "express";

import { verifyToken, verifyTokenAdmin } from "./utils";
import { City } from "../model/city";
import { Subscription } from "../model/subscription";
import { recordData } from "../model/recordData";
import { iotThing } from "../model/iotThing";

const cityRouter = Router();

//Admit admin to create new city
cityRouter.post(
  "/admin/createCity",
  verifyTokenAdmin,
  async (req, res, next) => {
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
  }
);

//Admit admin to update city
cityRouter.put(
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
cityRouter.delete(
  "/admin/deleteCity/:id",
  verifyToken,
  async (req, res, next) => {
    const id = req.params.id as any;
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
  }
);

//Admit admin to see all the cities with relative relations
cityRouter.get("/admin/cities", verifyTokenAdmin, async (req, res, next) => {
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
cityRouter.get("/cities", verifyToken, async (req, res, next) => {
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

//Return a specific city informations
cityRouter.get("/city/:state/:name", verifyToken, async (req, res, next) => {
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
cityRouter.get(
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
    const now = new Date().getTime();
    const yesterday = new Date(now - 24 * 60 * 60 * 1000).getTime();
    

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
    lastDayGraphData[lastDay.at(0)!.createdAt] =
      lastDay.at(0)?.alertLevel;
    //Take all the alert level chenges
    let lastAlert = lastDay.at(0)?.alertLevel;
    for (let record of lastDay) {
      if (record.alertLevel === lastAlert) {
        continue;
      }
      lastAlert = record.alertLevel;
      lastDayGraphData[record.createdAt] = record.alertLevel;
    }
    //Take the last point
    lastDayGraphData[lastDay.at(lastDay.length - 1)!.createdAt] =
      lastDay.at(lastDay.length - 1)?.alertLevel;

    res.send(lastDayGraphData);
  }
);

cityRouter.get(
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
    const now = new Date().getTime();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthTS = lastMonth.getTime()

    const lastDay = await recordRepository
      .createQueryBuilder("recordData")
      .where("recordData.city = :cityID", { cityID })
      .andWhere("recordData.createdAt BETWEEN :lastMonthTS AND :now", {
        lastMonthTS,
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
    lastDayGraphData[lastDay.at(0)!.createdAt] =
      lastDay.at(0)?.alertLevel;
    //Take all the alert level chenges
    let lastAlert = lastDay.at(0)?.alertLevel;
    for (let record of lastDay) {
      if (record.alertLevel === lastAlert) {
        continue;
      }
      lastAlert = record.alertLevel;
      lastDayGraphData[record.createdAt] = record.alertLevel;
    }
    //Take the last point
    lastDayGraphData[lastDay.at(lastDay.length - 1)!.createdAt] =
      lastDay.at(lastDay.length - 1)?.alertLevel;

    res.send(lastDayGraphData);
  }
);

cityRouter.post(
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
    fromDate = new Date(fromDate).getTime();
    toDate = new Date(toDate).getTime();

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

export default cityRouter;
