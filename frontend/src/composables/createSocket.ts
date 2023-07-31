import { io } from "socket.io-client";
import useToken from "../composables/useToken";
import { Socket } from "socket.io-client";
import { ref } from "vue";
import { noticationsStore } from "../store/notifications";

export const socket = ref<Socket | null>(null);

export function createSocket() {
  if (socket.value) {
    return;
  }

  const cookie = useToken();
  const jwt = cookie.get("EA-session");
  const store = noticationsStore();

  if (!jwt) return;
  socket.value = io(import.meta.env.VITE_BE_SOCKET_URL, {
    extraHeaders: {
      Authorization: "Bearer " + jwt,
    },
  });

  socket.value.on("notification", (args: any) => {
    store.addNotification(args);
  });
}

export function closeSocket() {
  socket.value?.close();
  socket.value = null;
}
