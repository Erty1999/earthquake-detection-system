import { defineStore } from "pinia";
import { ref } from "vue";

export const noticationsStore = defineStore("noticationsStore", () => {
  const notifications = ref<Array<string>>([]);
  const newNotifications = ref<number>(0);

  const actions = {
    addNotification(notification: string) {
      notifications.value.push(notification);
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
