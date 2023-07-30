import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import "reflect-metadata";
import "express-async-errors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { User } from "./model/user";
import cityRouter from "./routes/city";
import fileRouter from "./routes/file";
import iotThingRouter from "./routes/iotThing";
import subRouter from "./routes/subscription";
import userRouter from "./routes/user";
import recordDataRouter from "./routes/recordData";
import { AppDataSource, createBaseUsers } from "./dataSource";
import { data } from "./socket";

async function main() {
  await AppDataSource.initialize();
  await createBaseUsers(AppDataSource);
  const app = express();

  //Allow cors
  app.use(cors());

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // logger
  app.use(morgan("dev"));

  // safety
  app.use(helmet());

  // routes
  app.use(cityRouter);
  app.use(fileRouter);
  app.use(iotThingRouter);
  app.use(subRouter);
  app.use(userRouter);
  app.use(recordDataRouter);

  // port
  const port = process.env.PORT;

  app.listen(port, () => {
    console.log("Started on port " + port);
  });

  // Create an HTTP server using the Express app instance
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
    },
  });

  io.listen(3101);

  io.on("connection", (socket) => {
    const token = socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) return;
    jwt.verify(token, "secret", async (err: any, decoded: any) => {
      if (err) {
        return;
      }
      //Recover the user informations
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: [{ id: decoded.id }],
        select: ["id"],
      });
      if (!user) return;
      const userID = user.id + ""
      //Check and delete previous open socket 
      data.socketArray = data.socketArray.filter(
        (obj) => obj.userID !== (userID as any)
      );
      data.socketArray.push({ userID, socket } );
      console.log(userID + " start a socket connection");
    });
  });

  io.on("disconnect", (socket) => {
    console.log(socket.handshake.headers?.authorization);
    const token = socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) return;
    jwt.verify(token, "secret", async (err: any, decoded: any) => {
      if (err) {
        return;
      }
      //Recover the user informations
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: [{ id: decoded.id }],
        select: ["id"],
      });
      if (!user) return;
      const userID = user.id + ""
      data.socketArray = data.socketArray.filter(
        (obj) => obj.userID !== (userID as any)
      );
      console.log(userID + " socket connection closed");
    });
  });
}

main();
