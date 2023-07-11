import { defineStore } from "pinia";
import { User } from "./user";
import useAuthAxios from "../composables/useAuthAxios";

export const adminStore = defineStore("adminStore", () => {
  const actions = {
    async createUser(newUser: User, pwd: string) {
      let error;
      let response;

      await useAuthAxios()
        .post("/admin/createUser", {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          birthday: newUser.birthday,
          email: newUser.email,
          telNumber: newUser.telNumber,
          telegramUserID: newUser.telegramUserID,
          pwd: pwd,
        })
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },

    async usersList() {
      let error;
      let response;

      await useAuthAxios()
        .get("/admin/users")
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },
  };

  return { ...actions };
});
