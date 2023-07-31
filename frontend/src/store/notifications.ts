import { defineStore } from "pinia";
import { ref } from "vue";

export const noticationsStore = defineStore("noticationsStore", () => {
  const notifications = ref<Array<{ msg: string; time: string }>>([]);
  const newNotifications = ref<number>(0);

  const actions = {
    addNotification(notification: string) {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const time = hours + ":" + minutes;
      notifications.value.push({ msg: notification, time: time });
      newNotifications.value = newNotifications.value + 1;
    },

    deleteNotifications() {
      notifications.value = [];
      newNotifications.value = 0;
    },

    resetNewNotifications() {
      newNotifications.value = 0;
    },
  };

  return { notifications, newNotifications, ...actions };
});
