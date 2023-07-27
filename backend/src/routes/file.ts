import express from "express";

import { AppDataSource } from "../dataSource";
import { Router } from "express";

import { verifyTokenAdmin } from "./utils";
import { File } from "../model/file";

const fileRouter = Router();

//Images upload
fileRouter.post(
  "/admin/uploadFile",
  express.json({ limit: "10mb" }),
  verifyTokenAdmin,
  async (req, res) => {
    let error;
    const file = req.body.file;

    //Input fil check
    if (!file) {
      return res.status(400).send("Bad Request");
    }

    const fileRepository = AppDataSource.getRepository(File);

    //Check if file alredy exist, in that case return the relative id
    const existingFile = await fileRepository
      .createQueryBuilder("file")
      .where("data = :data", { data: file })
      .getOne();
    if (existingFile) {
      res.json(existingFile.id);
      return;
    }

    const savedFile = fileRepository.create({ data: file });
    await fileRepository.save(savedFile).catch((e) => {
      error = true;
    });

    //Check if the save was successful
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.json(savedFile.id);
  }
);

export default fileRouter;
