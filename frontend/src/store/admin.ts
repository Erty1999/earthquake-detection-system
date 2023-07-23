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

    async updateCity(city: City, idCity: string) {
      let error;
      let response;

      await useAuthAxios()
        .put("/admin/updateCity/" + idCity, {
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
      const base64 = await new Promise((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result!);
        reader.readAsDataURL(file);
      });

      //Upload File
      await useAuthAxios()
        .post("/admin/uploadFile", { file: base64 })
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      //Return id
      const respFile = response;
      return respFile;
    },

    async deleteCity(idCity: string) {
      let error;
      let response;

      await useAuthAxios()
        .delete("/admin/deleteCity/" + idCity)
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
