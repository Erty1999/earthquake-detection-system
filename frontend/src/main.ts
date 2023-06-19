import { createApp } from "vue";

import router from "./router";
import App from "./App.vue";

import "./style.css";

import DashboardLayout from "./layouts/DashboardLayout.vue";
import EmptyLayout from "./layouts/EmptyLayout.vue";

const app = createApp(App);

app.component("DefaultLayout", DashboardLayout);
app.component("EmptyLayout", EmptyLayout);

app.use(router);
app.mount("#app");
