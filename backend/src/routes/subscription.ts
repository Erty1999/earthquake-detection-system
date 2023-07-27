import express from "express";

import { AppDataSource } from "../dataSource";
import { User } from "../model/user";
import { Router } from "express";

import { verifyToken } from "./utils";
import { City } from "../model/city";
import { Subscription } from "../model/subscription";

const subRouter = Router();

subRouter.post("/subscription/:id", verifyToken, async (req, res, next) => {
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

subRouter.get("/subscription/:id", verifyToken, async (req, res, next) => {
  const id = req.params.id as any;
  let sub;

  //Get subscription
  const subsRepository = AppDataSource.getRepository(Subscription);
  try {
    sub = await subsRepository.findOne({
      where: [{ id }],
      relations: ["city"],
    });
  } catch {
    sub = null;
  }
  //Check if the save was successful
  if (!sub) {
    return res.status(404).json({ message: "No subscrition Founded" });
  }

  res.send(sub);
});

subRouter.get("/isSubscribed/:id", verifyToken, async (req, res, next) => {
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

subRouter.delete("/subscription/:id", verifyToken, async (req, res, next) => {
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

export default subRouter;
