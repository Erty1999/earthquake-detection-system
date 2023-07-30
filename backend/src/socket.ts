import { Socket } from "socket.io";

export const data = {
  socketArray: [],
} as {
  socketArray: { userID: string; socket: Socket }[];
};
