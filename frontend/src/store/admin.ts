import { defineStore } from "pinia";
import { User } from "./user";
import useAuthAxios from "../composables/useAuthAxios";

export type City = {
  id: string;
  name: string;
  region: string;
  state: string;
  lowThresh: number;
  highThresh: number;
};

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

    async createCity(city: City) {
      let error;
      let response;

      await useAuthAxios()
        .post("/admin/createCity", {
          ...city,
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

    async citiesList() {
      let error;
      let response;

      await useAuthAxios()
        .get("/admin/cities")
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },

    async uploadFile(file: File) {
      let error;
      let response;

      //Parse image format
      const formData = new FormData();
      formData.append("file", file, file.name);

      //Upload Image
      await useAuthAxios()
        .post("/admin/uploadFile", formData, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data`,
          },
        })
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      //Return path
      const path = (response as any).path;
      return path;
    },
  };

  return { ...actions };
});
