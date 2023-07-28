import { defineStore } from "pinia";
import { ref } from "vue";
import useAxios from "../composables/useAxios";
import useAuthAxios from "../composables/useAuthAxios";
import useToken from "../composables/useToken";
import formatDayGraphData from "../composables/formatDayGraphData";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  telNumber: string;
  telegramUserID: string;
  isAdmin?: boolean;
  avatar?: { id: string; data: string };
  subscriptions: Array<any>;
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
        path: "/",
      });

      return value;
    },

    async logout() {
      //Remove session cookie
      const cookie = useToken();
      cookie.remove("EA-session", {
        sameSite: "none",
        secure: true,
        path: "/",
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
          avatar: updatedUser.avatar?.id ?? null,
          pwd: pwd,
          isAdmin: updatedUser.isAdmin,
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
      const base64 = await new Promise((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result!);
        reader.readAsDataURL(avatar);
      });

      //Upload Image
      await useAxios()
        .post("/upload", { image: base64 })
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      //Return id
      const image = response;
      return image;
    },

    async citiesList() {
      let error;
      let response;

      await useAuthAxios()
        .get("/cities")
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      for (let city of response as any) {
        const sub = await this.isSubscribed(city.id);
        city.isSubscribed = sub;
      }
      return response;
    },

    async subscription(cityID: string) {
      let error;
      let response;

      await useAuthAxios()
        .post("/subscription/" + cityID)
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },

    async isSubscribed(cityID: string) {
      let error;
      let response;

      await useAuthAxios()
        .get("/isSubscribed/" + cityID)
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },

    async unSubscription(cityID: string) {
      let error;
      let response;

      await useAuthAxios()
        .delete("/subscription/" + cityID)
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },

    async cityInfo(cityState: string, cityName: string) {
      let error;
      let response;

      await useAuthAxios()
        .get("/city/" + cityState + "/" + cityName)
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      const sub = await this.isSubscribed((response as any).id);
      (response as any).isSubscribed = sub;

      return response;
    },

    //Last Day alert data
    async lastDayGraphData(cityState: string, cityName: string) {
      let error;
      let response;

      await useAuthAxios()
        .get("/city/" + cityState + "/" + cityName + "/lastDayChartData")
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },

    //Last Month alert data
    async lastMonthGraphData(cityState: string, cityName: string) {
      let error;
      let response;

      await useAuthAxios()
        .get("/city/" + cityState + "/" + cityName + "/lastMonthChartData")
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      return response;
    },

    //Retrive records of a given period
    async recoverRecords(
      cityState: string,
      cityName: string,
      fromDate: string,
      toDate: string
    ) {
      let error;
      let response;

      //Format Input Data
      let d1 = new Date(fromDate);
      let d2 = new Date(toDate);
      if (fromDate == toDate) {
        d1.setHours(0);
        d1.setMinutes(0);

        d2.setHours(23);
        d2.setMinutes(59);
      } else {
        d1.setHours(new Date().getHours());
        d1.setMinutes(new Date().getMinutes());

        d2.setHours(new Date().getHours());
        d2.setMinutes(new Date().getMinutes());
      }

      await useAuthAxios()
        .post("/city/" + cityState + "/" + cityName + "/recoverRecords", {
          fromDate: d1.getTime(),
          toDate: d2.getTime(),
        })
        .then((res) => {
          response = res.data;
        })
        .catch((e) => {
          error = e;
        });

      if (error) throw error;

      //Reformat data value
      if (response && (response as any).length != 0) {
        for (let record of response as any) {
          const date = new Date(+record?.createdAt);
          const formattedDate = date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: 'Europe/Rome',
          });
          record.createdAt = formattedDate;
        }
      }

      return response;
    },

    async recoverCityFromSubs(subs: Array<any>) {
      let error;
      let subList = [];
      let cityList = [];

      //Recover subs info
      for (let sub of subs) {
        let response;
        await useAuthAxios()
          .get("/subscription/" + sub?.id)
          .then((res) => {
            response = res.data;
          })
          .catch((e) => {
            error = e;
          });

        if (error) throw error;

        subList.push(response);
      }

      //Recover city info
      for (let sub of subList as any) {
        let response;
        await useAuthAxios()
          .get(
            "/city/" +
              (sub as any)?.city?.state +
              "/" +
              (sub as any)?.city?.name
          )
          .then((res) => {
            response = res.data;
          })
          .catch((e) => {
            error = e;
          });

        if (error) throw error;

        cityList.push(response);
      }

      //Recover the graph data
      for (let city of cityList) {
        let lastDayGraphRowData = ref();
        let lastDayGraphData = null;

        //Last day graph data
        lastDayGraphRowData.value = await this.lastDayGraphData(
          (city as any)?.state as string,
          (city as any)?.name as string
        );

        if (lastDayGraphRowData.value) {
          lastDayGraphData = await formatDayGraphData(lastDayGraphRowData);
        }

        //Add graph data without toolbar
        (city as any)["lastDayGraphData"] = lastDayGraphData;
        if ((city as any).lastDayGraphData) {
          (city as any).lastDayGraphData.options.chart.toolbar.show = false;
        }
      }

      return cityList;
    },
  };

  return { user, ...actions };
});
