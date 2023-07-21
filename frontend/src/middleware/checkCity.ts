import { RouteLocationNormalized } from "vue-router";
import { userStore } from "../store/user";
import { ref } from "vue";

export default async function adminAuth(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: (route?: string) => void
) {
  const store = userStore();
  const city = ref();

  //Check if the city exists, and if it doesn't exist redirect to 404
  city.value = await store
    .cityInfo(to.params?.state as string, to.params?.name as string)
    .catch(() => {
      next("/error404");
      return;
    });

  next();
}
