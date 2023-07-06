import { defineStore } from "pinia";
import { ref } from "vue";
import useAxios from "../composables/useAxios";
import useToken from "../composables/useToken";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  telNumber: string;
  telegramUserID: string;
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
          console.log(e)
        });

      if (error) throw error;
      
      return response;
    },

    // async login(credentials: Credentials) {
    //   const { data, error } = await useFetch("/api/user/login", {
    //     method: "POST",
    //     body: {
    //       identifier: credentials.identifier,
    //       password: credentials.password,
    //     },
    //   });

    //   if (error.value) {
    //     throw error.value;
    //   }

    //   const value = data.value as { jwt: string; user: User };

    //   const token = useToken();
    //   token.value = value.jwt;

    //   //Recover user avatar
    //   const me = await useFetch("/api/user/me", {
    //     method: "GET",
    //     headers: {
    //       Authorization: "Bearer " + value.jwt,
    //     },
    //   });

    //   if (me.error.value) {
    //     token.value = null;
    //     throw me.error.value;
    //   }

    //   user.value = toRaw(me.data.value) as User;
    // const cookie = useToken();
    //   cookie.set("EA-session", (response as any).token);

    //   return value;
    // },

    async logout() {
      //   const token = useToken();
      //   token.value = null;

      user.value = null;
    },
  };

  return { user, ...actions };
});
