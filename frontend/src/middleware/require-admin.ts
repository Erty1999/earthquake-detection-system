import { RouteLocationNormalized } from "vue-router";
import { userStore } from "../store/user";

export default async function adminAuth(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: (route?: string) => void
) {
  const store = userStore();

  /*Check jwt validity, if it isn't redirect to login
    This function also repopulate the store user istance */
  const user = store.user;

  //If it isn't an admin redirect him to the dashboard
  if (!(user as any)?.isAdmin) {
    next("/error403");
    return;
  }

  next();
}
