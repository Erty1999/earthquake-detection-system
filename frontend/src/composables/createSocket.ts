import { io } from "socket.io-client";
import useToken from "../composables/useToken";
import { Socket } from "socket.io-client";
import { ref } from "vue";

export const socket = ref<Socket | null>(null);

export function createSocket() {
  if (socket.value) {
    return;
  }

  const cookie = useToken();
  const jwt = cookie.get("EA-session");

  if (!jwt) return;
  socket.value = io("ws://localhost:3101", {
    extraHeaders: {
      Authorization: "Bearer " + jwt,
    },
  });

  socket.value.on("notification", (args: any) => {
    console.log(args);
  });
}

export function closeSocket() {
  socket.value?.close();
  socket.value = null;
}
