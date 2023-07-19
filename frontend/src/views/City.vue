<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { userStore } from "../store/user";
import formatDayGraphData from "../composables/formatDayGraphData";
import formatMonthGraphData from "../composables/formatMonthGraphData";

import { useRoute } from "vue-router";

const storeUser = userStore();
const route = useRoute();

const city = ref();
const lastDayGraphRowData = ref();
const lastMonthGraphRowData = ref();
const lastDayGraphData = ref();
const lastMonthGraphData = ref();

onBeforeMount(async () => {
  city.value = await storeUser.cityInfo(
    route.params?.state as string,
    route.params?.name as string
  );
  //Last day graph data
  lastDayGraphRowData.value = await storeUser.lastDayGraphData(
    route.params?.state as string,
    route.params?.name as string
  );
  lastDayGraphData.value = formatDayGraphData(lastDayGraphRowData);

  //Last month graph data
  lastMonthGraphRowData.value = await storeUser.lastMonthGraphData(
    route.params?.state as string,
    route.params?.name as string
  );
  lastMonthGraphData.value = formatMonthGraphData(lastMonthGraphRowData);
  console.log(city);
});

//Function that manage the subscription
async function follow() {
  let error;
  await storeUser.subscription(city.value?.id).catch((e) => {
    error = e;
  });
  if (error) return;
  city.value = await storeUser.cityInfo(
    route.params?.state as string,
    route.params?.name as string
  );
}

//Function that manage the unsubscription
async function unfollow() {
  let error;
  await storeUser.unSubscription(city.value?.id).catch((e) => {
    error = e;
  });
  if (error) return;
  city.value = await storeUser.cityInfo(
    route.params?.state as string,
    route.params?.name as string
  );
}

function convertDate(time: any) {
  const date = new Date(time);
  return date.toLocaleDateString("UTC", {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
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
          <h1 class="mx-auto mt-14 font-bold caitalize text-2xl md:text-4xl">
            <div class="text-center">
              <h3
                class="text-4xl font-semibold leading-normal mb-2 text-blueGray-700"
              >
                {{ city?.name }}
              </h3>
              <div
                class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
              >
                <i
                  class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"
                ></i>
                {{ city?.region }}, {{ " " + city?.state }}
              </div>
            </div>
          </h1>
        </div>
      </div>
    </section>

    <section class="relative py-16">
      <div class="container mx-auto px-4">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-96 text-center"
        >
          <div class="px-6 w-full flex-col">
            <div class="flex flex-wrap w-full">
              <!-- left group -->
              <div class="sm:w-1/3 w-1/2 text-center">
                <div class="py-6 px-3 flex">
                  <button
                    v-if="city?.isSubscribed"
                    class="text-white bg-red-500 p-2 rounded-lg flex gap-x-1 my-2 px-2.5 m-auto"
                    @click="
                      (event) => {
                        unfollow();
                        event.stopPropagation();
                      }
                    "
                  >
                    Unfollow
                  </button>

                  <button
                    v-else
                    class="text-white bg-indigo-600 p-2 rounded-lg flex gap-x-1 my-2 m-auto"
                    @click="
                      (event) => {
                        follow();
                        event.stopPropagation();
                      }
                    "
                  >
                    Follow
                  </button>
                </div>
              </div>

              <!-- central group -->
              <div class="sm:w-1/3 w-1/2 text-center flex justify-center mt-3">
                <div class="sm:mr-4 p-3 text-center">
                  <span
                    class="text-xl font-bold block uppercase tracking-wide"
                    >{{ city?.subscriptions }}</span
                  ><span class="text-sm text-gray-500">Followers</span>
                </div>
                <div class="p-3 text-center">
                  <span
                    class="text-xl font-bold block uppercase tracking-wide"
                    >{{ city?.lastUpdate?.activeSensors ?? "0" }}</span
                  ><span class="text-sm text-gray-500">Active Sensors</span>
                </div>
              </div>

              <!-- right group -->
              <div class="sm:w-1/3 w-full text-center flex justify-center">
                <div class="w-full px-4 flex-col text-center mt-7">
                  <div
                    v-if="!city?.lastUpdate?.alertLevel"
                    class="flex flex-col text-gray-800 bg-gray-300 rounded-full p-3 w-fit mx-auto"
                  >
                    No Data
                  </div>

                  <div
                    v-if="city?.lastUpdate?.alertLevel === 'none'"
                    class="flex text-green-900 bg-green-200 rounded-full p-1 px-3 w-fit mx-auto"
                  >
                    Pacific
                  </div>
                  <div
                    v-if="city?.lastUpdate?.alertLevel === 'low'"
                    class="flex text-orange-800 bg-orange-100 rounded-full p-1 px-3 w-fit mx-auto"
                  >
                    Low Alert
                  </div>
                  <div
                    v-if="city?.lastUpdate?.alertLevel === 'high'"
                    class="flex text-red-800 bg-red-200 rounded-full p-1 px-3 w-fit mx-auto"
                  >
                    High Alert
                  </div>
                  <div
                    v-if="city?.lastUpdate?.alertLevel"
                    class="text-sm leading-5 text-gray-500"
                  >
                    Last update at
                    {{ convertDate(city?.lastUpdate?.createdAt) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- line -->
            <div class="mt-4 py-4 border-t text-center"></div>

            <div class="flex flex-wrap w-full mt-10">
              <div class="xl:w-1/2 w-full flex-col text-center">
                <div class="w-fit m-auto">
                  <h1 class="text-lg font-medium">Last Day Alert Changes</h1>
                  <apexchart
                    v-if="lastDayGraphData"
                    width="500"
                    type="line"
                    :options="lastDayGraphData.options"
                    :series="lastDayGraphData.series"
                  ></apexchart>
                </div>
              </div>
              <div class="xl:w-1/2 w-full flex-col text-center">
                <div class="w-fit m-auto">
                  <h1 class="text-lg font-medium">Last Month Alert Changes</h1>
                  <apexchart
                    v-if="lastMonthGraphData"
                    width="500"
                    type="line"
                    :options="lastMonthGraphData.options"
                    :series="lastMonthGraphData.series"
                  ></apexchart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
