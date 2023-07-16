import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import auth from "./middleware/require-auth";
import noAuth from "./middleware/require-no-auth";
import adminAuth from "./middleware/require-admin";

import Home from "./views/Home.vue";
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
import Cities from "./views/admin/Cities.vue";
import Users from "./views/admin/Users.vue";
import error403 from "./views/errors/error403.vue";
import error404 from "./views/errors/error404.vue";
import CitiesList from "./views/Cities.vue";
import NotificationCentre from "./views/NotificationCentre.vue";
import City from "./views/City.vue";
import iotThingVue from "./views/admin/iotThing.vue";

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
    path: "/Me",
    name: "Me",
    component: Me,
    beforeEnter: auth,
  },
  {
    path: "/Home",
    name: "Home",
    component: Home,
    beforeEnter: auth,
  },
  {
    path: "/Cities",
    name: "Cities",
    component: CitiesList,
    beforeEnter: auth,
  },
  {
    path: "/:state/:name",
    name: "City",
    component: City,
    beforeEnter: auth,
  },
  {
    path: "/NotificationCentre",
    name: "NotificationCentre",
    component: NotificationCentre,
    beforeEnter: auth,
  },
  {
    path: "/Admin/Cities",
    name: "AdminCities",
    component: Cities,
    beforeEnter: [auth, adminAuth],
  },
  {
    path: "/Admin/Users",
    name: "AdminUsers",
    component: Users,
    beforeEnter: [auth, adminAuth],
  },
  {
    path: "/Admin/IoTthing",
    name: "IoTthing",
    component: iotThingVue,
    beforeEnter: [auth, adminAuth],
  },
  {
    path: "/error403",
    name: "error403",
    component: error403,
    meta: { layout: "empty" },
  },
  // Catch-all others route
  {
    path: "/:pathMatch(.*)*",
    name: "error404",
    component: error404,
    meta: { layout: "empty" },
  },

  //TODO: Remove
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
