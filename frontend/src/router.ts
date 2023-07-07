import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import auth from "./middleware/require-auth";
import noAuth from "./middleware/require-no-auth";

import Dashboard from "./views/Dashboard.vue";
import Forms from "./views/Forms.vue";
import Tables from "./views/Tables.vue";
import UIElements from "./views/UIElements.vue";
import Login from "./views/Login.vue";
import Modal from "./views/Modal.vue";
import Card from "./views/Card.vue";
import Blank from "./views/Blank.vue";
import Register from "./views/Register.vue";
import Index from "./views/Index.vue";
import Me from "./views/Me.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: { layout: "empty" },
    beforeEnter: noAuth,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { layout: "empty" },
    beforeEnter: noAuth,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { layout: "empty" },
    beforeEnter: noAuth,
  },
  {
    path: "/me",
    name: "Me",
    component: Me,
    beforeEnter: auth,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: auth,
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms,
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  {
    path: "/blank",
    name: "Blank",
    component: Blank,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
