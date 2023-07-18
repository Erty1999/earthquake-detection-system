<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { userStore } from "../store/user";

import { useRoute } from "vue-router";

const storeUser = userStore();
const route = useRoute();

const city = ref();
const lastDayGraphData = ref();
const lastMonthGraphData = ref();

onBeforeMount(async () => {
  city.value = await storeUser.cityInfo(
    route.params?.state as string,
    route.params?.name as string
  );
  lastDayGraphData.value = await storeUser.lastDayGraphData(
    route.params?.state as string,
    route.params?.name as string
  );
  lastMonthGraphData.value = await storeUser.lastMonthGraphData(
    route.params?.state as string,
    route.params?.name as string
  );
});

const options = {
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
};
const series = [
  {
    name: "series-1",
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
];
</script>

<template>
  <div class="rounded-t-lg">
    <section class="relative block rounded-t-lg" style="height: 500px">
      <!--TODO : CUSTOM FOTO DI BACKGROUND-->
      <div
        class="absolute top-0 w-full h-full bg-center bg-cover rounded-t-lg"
        style="
          background-image: url('https://images.unsplash.com/photo-1593075356257-252c29b02ce8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
        "
      >
        <div
          class="w-full h-full absolute bg-opacity-60 bg-black rounded-t-lg text-white flex"
        >
          <h1 class="mx-auto mt-20 font-bold caitalize text-2xl md:text-4xl">
            {{ city.name ?? "" }}
          </h1>
        </div>
      </div>
    </section>

    <section class="relative py-16">
      <div class="container mx-auto px-4">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-96"
        >
          <div class="px-6">
            <h1>MY INFO</h1>
            <apexchart
              width="500"
              type="line"
              :options="options"
              :series="series"
            ></apexchart>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
