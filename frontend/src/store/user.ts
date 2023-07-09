import { defineStore } from "pinia";
import { ref } from "vue";
import useAxios from "../composables/useAxios";
import useAuthAxios from "../composables/useAuthAxios";
import useToken from "../composables/useToken";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  telNumber: string;
  telegramUserID: string;
  isAdmin?: boolean;
  avatar?: string;
};

export type Credentials = {
  email: string;
  pwd: string;
};

export const userStore = defineStore("userStore", () => {
  const user = ref<null | User>(null);

  const actions = {
    async register(newUser: User, pwd: string) {
      let error;
      let response;

      await useAxios()
        .post("/register", {
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

    async login(credentials: Credentials) {
      let error;
      let response;

      await useAxios()
        .post("/login", {
          email: credentials.email,
          pwd: credentials.pwd,
        })
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      const value = response as any as { user: User; token: string };

      //Populate the store user istance
      user.value = value.user;

      //Create session cookie
      const cookie = useToken();
      cookie.set("EA-session", value.token, {
        sameSite: "none",
        secure: true,
      });

      return value;
    },

    async logout() {
      //Remove session cookie
      const cookie = useToken();
      cookie.remove("EA-session", {
        sameSite: "none",
        secure: true,
      });

      //Delete store user istance
       user.value = null;
    },

    async me() {
      let error;
      let response;

      await useAuthAxios()
        .get("/me")
        .then((res) => {
          response = res.data;
        })
        .catch(async (e) => {
          //Delete coockie if the user is unauthorized
          if (e.response.status === 401) {
            await this.logout();
          }
          error = e;
        });

      if (error) throw error;

      //Populate the store user istance
      user.value = response as any as User;

      return response;
    },

    async updateUser(updatedUser: User, pwd: string) {
      let error;
      let response;

      await useAuthAxios()
        .put("/users/" + updatedUser.id, {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          birthday: updatedUser.birthday,
          email: updatedUser.email,
          telNumber: updatedUser.telNumber,
          telegramUserID: updatedUser.telegramUserID,
          avatar : updatedUser.avatar ?? null,
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

    async uploadAvatar(avatar: File) {
      let error;
      let response;

      //Parse image format
      const formData = new FormData();
      formData.append("image", avatar, avatar.name);

      //Upload Image
      await useAxios()
        .post("/upload", formData, {
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

      //Return url
      const url = (response as any).imageUrl;
      return url;
    },
  };

  return { user, ...actions };
});
