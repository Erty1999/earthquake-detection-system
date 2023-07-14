import { RouteLocationNormalized } from "vue-router";

import { userStore } from "../store/user";

export default async function noAuth(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: (route?: string) => void
) {
  let error = false;
  const store = userStore();

  /*Check jwt validity, if it is redirect to home
    This function also repopulate the store user istance */
  await store.me().catch((_e) => {
    error = true;
  });

  if (!error) {
    next("/home");
    return;
  }

  next();
}
