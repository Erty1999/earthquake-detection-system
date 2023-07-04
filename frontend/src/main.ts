import { createApp } from "vue";
import { createPinia } from "pinia";

import router from "./router";
import App from "./App.vue";
import "./style.css";

import DashboardLayout from "./layouts/DashboardLayout.vue";
import EmptyLayout from "./layouts/EmptyLayout.vue";

const app = createApp(App);
const pinia = createPinia();

app.component("DefaultLayout", DashboardLayout);
app.component("EmptyLayout", EmptyLayout);

app.use(pinia);
app.use(router);
app.mount("#app");
