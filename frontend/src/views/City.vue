<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import { userStore } from "../store/user";
import formatDayGraphData from "../composables/formatDayGraphData";
import formatMonthGraphData from "../composables/formatMonthGraphData";
import {
  AcademicCapIcon,
  ArrowPathRoundedSquareIcon,
  ClockIcon,
  InformationCircleIcon,
  PresentationChartLineIcon,
  WalletIcon,
} from "@heroicons/vue/24/outline";

import { useRoute } from "vue-router";
import { City, adminStore } from "../store/admin";
import router from "../router";

const storeUser = userStore();
const storeAdmin = adminStore();
const route = useRoute();

const city = ref();

const lastDayGraphRowData = ref();
const lastMonthGraphRowData = ref();
const lastDayGraphData = ref();
const lastMonthGraphData = ref();

const fromDate = ref();
const toDate = ref();
const currentDate = ref(new Date().toISOString().slice(0, 10));
const records = ref();
const noData = ref(false);

const name = ref("");
const region = ref("");
const state = ref("");
const lowThresh = ref();
const highThresh = ref();

const error = ref("");
const success = ref("");
const hasChanged = ref(false);

const user = computed(() => storeUser.user);

onBeforeMount(async () => {
  city.value = await storeUser.cityInfo(
    route.params?.state as string,
    route.params?.name as string
  );

  //Inizialize update form
  name.value = city.value.name;
  region.value = city.value.region;
  state.value = city.value.state;
  lowThresh.value = city.value.lowThresh;

  //Last day graph data
  lastDayGraphRowData.value = await storeUser.lastDayGraphData(
    route.params?.state as string,
    route.params?.name as string
  );
  if (lastDayGraphRowData.value) {
    lastDayGraphData.value = await formatDayGraphData(lastDayGraphRowData);
  }

  //Last month graph data
  lastMonthGraphRowData.value = await storeUser.lastMonthGraphData(
    route.params?.state as string,
    route.params?.name as string
  );
  if (lastMonthGraphRowData.value) {
    lastMonthGraphData.value = await formatMonthGraphData(
      lastMonthGraphRowData
    );
  }
});

//Function that reload the page in order to refresh page data
function refreshData() {
  location.reload();
}

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

//Recover recordData from BE
async function findRecords() {
  noData.value = false;
  const date1 = new Date(fromDate.value).getTime();
  const date2 = new Date(toDate.value).getTime();

  //If the toDate is higher than fromDate, switch them
  if (date1 > date2) {
    const temp = toDate.value;
    toDate.value = fromDate.value;
    fromDate.value = temp;
  }
  records.value = await storeUser.recoverRecords(
    route.params?.state as string,
    route.params?.name as string,
    fromDate.value,
    toDate.value
  );
  if (records.value?.length === 0) {
    noData.value = true;
  }
  
}

//Function that manage the submit event
async function submit() {
  error.value = "";
  success.value = "";

  //check possible input errors
  if (!name.value || !region.value || !state.value) {
    error.value = "Please complete all fields";
    return;
  }

  //city update istance
  const updatedCity = {
    name: name.value,
    region: region.value,
    state: state.value,
    lowThresh: lowThresh.value,
    highThresh: highThresh.value,
  } as City;

  //City update by admin
  await storeAdmin.updateCity(updatedCity, city.value.id).catch((e) => {
    error.value =
      e?.response?.data?.message ??
      "Internal server error, please try again...";
  });

  if (error.value) return;

  //Update page values
  city.value.name = updatedCity.name;
  city.value.state = updatedCity.state;
  city.value.region = updatedCity.region;
  city.value.lowThresh = updatedCity.lowThresh;
  city.value.highThresh = updatedCity.highThresh;

  //If the name or the state change, change route
  if (
    updatedCity.name != route.params?.name ||
    updatedCity.state != route.params?.state
  ) {
    router.push("/" + updatedCity.state + "/" + updatedCity.name);
  }

  //Show success message
  success.value = "City correctly updated";

  hasChanged.value = false;
}

function resetValues() {
  name.value = city.value?.name;
  region.value = city.value?.region;
  state.value = city.value?.state;
  lowThresh.value = city.value?.lowThresh;
  highThresh.value = city.value?.highThresh;

  error.value = "";
  success.value = "";
  hasChanged.value = false;
}

function onChangeInput() {
  hasChanged.value = true;
  error.value = "";
  success.value = "";
}

//Function that manage the deletion of th city
async function deleteCity() {
  await storeAdmin.deleteCity(city.value.id).catch((e) => {
    error.value =
      e?.response?.data?.message ??
      "Oops, something went wrong, the city was not deleted";
  });

  if (error.value) {
    return;
  }

  //redirect to cities page
  router.push("/cities");
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
              <h3 class="text-4xl font-semibold leading-normal mb-2">
                {{ city?.name }}
              </h3>
              <div class="text-sm leading-normal mt-0 mb-2 font-bold uppercase">
                <i class="mr-2 text-lg"></i>
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
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-96"
        >
          <div class="px-6 w-full flex-col mt-2 text-gray-600">
            <!--refresh data-->
            <div
              class="flex ml-auto capitalize w-fit cursor-pointer"
              @click="refreshData()"
            >
              <ArrowPathRoundedSquareIcon class="h-7 w-7 mr-1" /><span
                class="mt-0.5"
                >refresh data</span
              >
            </div>

            <div class="flex flex-wrap w-full">
              <!-- left group -->
              <div class="sm:w-1/3 w-1/2 text-center">
                <div class="py-6 px-3 flex">
                  <button
                    v-if="city?.isSubscribed"
                    class="text-white bg-red-500 p-2 rounded-lg flex px-2.5 m-auto"
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
                    class="text-white bg-indigo-600 p-2 rounded-lg flex px-2.5 m-auto"
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
                    class="text-xl font-bold block uppercase tracking-wide text-gray-800"
                    >{{ city?.subscriptions ?? "0" }}</span
                  ><span class="text-sm text-gray-500">Followers</span>
                </div>
                <div class="p-3 text-center">
                  <span
                    class="text-xl font-bold block uppercase tracking-wide text-gray-800"
                    >{{ city?.lastUpdate?.activeSensors ?? "0" }}</span
                  ><span class="text-sm text-gray-500">Active Sensors</span>
                </div>
              </div>

              <!-- right group -->
              <div class="sm:w-1/3 w-full text-center flex justify-center">
                <div class="w-full px-4 flex-col text-center mt-3">
                  Last Update:
                  <div
                    v-if="!city?.lastUpdate?.alertLevel"
                    class="flex flex-col text-gray-800 bg-gray-300 rounded-full px-3 py-1 w-fit mx-auto"
                  >
                    No Data
                  </div>

                  <div
                    v-if="city?.lastUpdate?.alertLevel === 'none'"
                    class="flex text-green-900 bg-green-200 rounded-full py-1 px-3 w-fit mx-auto"
                  >
                    Pacific
                  </div>
                  <div
                    v-if="city?.lastUpdate?.alertLevel === 'low'"
                    class="flex text-orange-800 bg-orange-100 rounded-full py-1 px-3 w-fit mx-auto"
                  >
                    Low Alert
                  </div>
                  <div
                    v-if="city?.lastUpdate?.alertLevel === 'high'"
                    class="flex text-red-800 bg-red-200 rounded-full py-1 px-3 w-fit mx-auto"
                  >
                    High Alert
                  </div>
                  <div
                    v-if="city?.lastUpdate?.alertLevel"
                    class="text-sm leading-5 text-gray-500"
                  >
                    at :
                    {{ convertDate(city?.lastUpdate?.createdAt) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- monitoring section -->
            <!-- line -->
            <div class="mt-4 mb-1 border-t"></div>
            <div class="inline-flex mb-2">
              <PresentationChartLineIcon class="w-5 h-5 mr-2 text-gray-400" />
              <h1
                class="text-sm leading-normal font-bold uppercase text-gray-400"
              >
                Monitoring Section
              </h1>
            </div>

            <!-- charts-->
            <div class="flex flex-wrap w-full mb-5">
              <div
                class="xl:w-1/2 w-full overflow-x-auto overflow-y-hidden flex-col text-center"
              >
                <div
                  class="w-fit m-auto bg-gray-100 flex-col pt-6 px-6 rounded-lg shadow-lg mt-4"
                >
                  <h1 class="text-lg font-medium mb-6 text-gray-800">
                    Last Day Alert Levels
                  </h1>
                  <apexchart
                    v-if="lastDayGraphData"
                    width="500"
                    type="line"
                    :options="lastDayGraphData.options"
                    :series="lastDayGraphData.series"
                  ></apexchart>
                  <div v-else style="width: 500px" class="pb-6">
                    NO RECENT DATA AVAIBLE
                  </div>
                </div>
              </div>
              <div
                class="xl:w-1/2 w-full overflow-x-auto overflow-y-hidden flex-col text-center"
              >
                <div
                  class="w-fit m-auto bg-gray-100 flex-col pt-6 px-6 rounded-lg shadow-lg mt-4"
                >
                  <h1 class="text-lg font-medium mb-6 text-gray-800">
                    Last Month Alert Levels
                  </h1>
                  <apexchart
                    v-if="lastMonthGraphData?.series?.at(0)"
                    width="500"
                    type="line"
                    :options="lastMonthGraphData.options"
                    :series="lastMonthGraphData.series"
                  ></apexchart>
                  <div v-else style="width: 500px" class="pb-6">
                    NO RECENT DATA AVAIBLE
                  </div>
                </div>
              </div>
            </div>

            <!--Sensor Surveys Data-->
            <div
              class="mt-10 mb-5 w-5/6 bg-gray-100 rounded-md m-auto"
              style="height: 500px"
            >
              <section class="flex flex-col w-full h-full shadow-md">
                <div class="py-2 -my-2 h-full overflow-x-auto overflow-y-auto">
                  <div
                    class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg bg-gray-50"
                  >
                    <div class="flex text-gray-700 mt-6 ml-5 mb-5 items-center">
                      <div class="w-1/2 flex">
                        <WalletIcon
                          class="h-12 rounded-full p-2 bg-pink-600 text-white"
                        />
                        <h2 class="text-3xl font-medium text-gray-700 ml-3">
                          Sensors Surveys Data
                        </h2>
                      </div>
                      <form
                        class="flex ml-auto"
                        @submit.prevent="findRecords()"
                      >
                        <div class="relative z-0 w-20 my-6 mr-7">
                          <input
                            v-model="fromDate"
                            v-bind:max="currentDate"
                            type="date"
                            class="block py-2.5 px-0 w-fit text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                          />
                          <label
                            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >From</label
                          >
                        </div>
                        <div class="relative z-0 w-20 my-6 mx-7">
                          <input
                            v-model="toDate"
                            v-bind:max="currentDate"
                            type="date"
                            class="block py-2.5 px-0 w-fit text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                          />
                          <label
                            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >To</label
                          >
                        </div>
                        <button
                          class="text-white w-fit my-6 mx-7 px-4 py-1 bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                          type="submit"
                        >
                          Show Data
                        </button>
                      </form>
                    </div>

                    <table class="min-w-full">
                      <thead>
                        <tr>
                          <th
                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                          >
                            Timestamp
                          </th>
                          <th
                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                          >
                            active Sensors
                          </th>
                          <th
                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                          >
                            triggered Sensors
                          </th>
                          <th
                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                          >
                            Low T.
                          </th>
                          <th
                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                          >
                            High T.
                          </th>

                          <th
                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                          >
                            alert Level
                          </th>
                        </tr>
                      </thead>

                      <tbody class="bg-white">
                        <tr
                          v-if="records"
                          v-for="(record, index) in records"
                          :key="index"
                          class="text-center"
                        >
                          <td
                            class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                          >
                            <div class="flex items-center">
                              <div class="flex-shrink-0 w-10 h-10">
                                <ClockIcon
                                  class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-gray-600 bg-gray-300 p-1"
                                />
                              </div>

                              <div class="ml-4">
                                <div
                                  class="text-sm font-medium leading-5 text-gray-900"
                                >
                                  {{
                                    record?.createdAt
                                  }}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td
                            class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                          >
                            <span
                              class="inline-flex px-2 text-sm font-semibold leading-5 text-gray-600"
                              >{{ record?.activeSensors }}</span
                            >
                          </td>
                          <td
                            class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                          >
                            <span
                              class="inline-flex px-2 text-sm font-semibold leading-5 text-gray-600"
                              >{{ record?.triggeredSensors }}</span
                            >
                          </td>

                          <td
                            class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                          >
                            <span
                              class="inline-flex px-2 text-sm font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full"
                              >{{ record?.lowThresh }}%</span
                            >
                          </td>

                          <td
                            class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                          >
                            <span
                              class="inline-flex px-2 text-sm font-semibold leading-5 text-red-800 bg-red-100 rounded-full"
                              >{{ record?.highThresh }}%</span
                            >
                          </td>

                          <td
                            class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                          >
                            <span
                              class="inline-flex px-2 text-sm font-semibold leading-5 text-black capitalize"
                              >{{ record?.alertLevel }}</span
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      v-if="noData"
                      class="w-full font-medium text-center my-4 text-gray-700"
                    >
                      NO DATA AVAIBLE BETWEEN {{ fromDate }} AND {{ toDate }}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- info section -->
            <section class="mb-2">
              <!-- line -->
              <div class="mt-10 mb-1 border-t"></div>
              <div class="w-full inline-flex mb-2">
                <InformationCircleIcon class="w-5 h-5 mr-2 text-gray-400" />
                <h1
                  class="text-sm leading-normal font-bold uppercase text-gray-400"
                >
                  Info Section
                </h1>
              </div>
              <div class="ml-3">
                The various alert levels are constantly detected by our sensors
                scattered around the city. The alert is triggered when the
                number of sensors detecting vibration exceeds the percentage set
                by the thresholds. Our operators calibrate the alert thresholds
                city by city, with the goal of making our service as accurate as
                possible.
              </div>
              <div class="flex gap-x-5 w-full justify-between mt-8">
                <div class="flex-col w-1/4 text-center">
                  <div class="m-auto">
                    <span
                      class="text-xl font-bold block uppercase tracking-wide text-gray-800"
                      >{{ city?.lastUpdate?.activeSensors ?? "0" }}</span
                    ><span class="text-sm text-gray-500 capitalize">Active Sensors</span>
                  </div>
                </div>
                <div class="flex w-1/4 text-center">
                  <div class="m-auto">
                    <span
                      class="text-xl font-bold block uppercase tracking-wide text-gray-800"
                      >{{ city?.lowThresh + "%" ?? "undefined" }} </span
                    ><span class="text-sm text-gray-500 capitalize">current low alert threshold</span>
                  </div>
                </div>
                <div class="flex w-1/4 text-center">
                  <div class="m-auto">
                    <span
                      class="text-xl font-bold block uppercase tracking-wide text-gray-800"
                      >{{ city?.highThresh + "%" ?? "undefined" }}</span
                    ><span class="text-sm text-gray-500 capitalize">current high alert threshold</span>
                  </div>
                </div>
              </div>
            </section>
            <!-- admin section -->
            <section v-if="user?.isAdmin">
              <!-- line -->
              <div class="mt-12 mb-1 border-t"></div>
              <div class="w-full inline-flex mb-2">
                <AcademicCapIcon class="w-5 h-5 mr-2 text-gray-400" />
                <h1
                  class="text-sm leading-normal font-bold uppercase text-gray-400"
                >
                  Admin Section
                </h1>
              </div>
              <!-- change org info section -->
              <div class="w-full">
                <div class="flex justify-center">
                  <div
                    class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-slate-200 rounded-lg shadow-md my-4"
                    v-if="error"
                  >
                    <div
                      class="flex items-center justify-center w-12 bg-red-500"
                    >
                      <svg
                        class="w-6 h-6 text-white fill-current"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                        />
                      </svg>
                    </div>

                    <div class="px-4 py-2 -mx-3">
                      <div class="mx-3">
                        <span class="font-semibold text-red-500">Error</span>
                        <p class="text-sm text-gray-600">
                          {{ error }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-slate-200 rounded-lg shadow-md my-4"
                    v-if="success"
                  >
                    <div
                      class="flex items-center justify-center w-12 bg-green-500"
                    >
                      <svg
                        class="w-6 h-6 text-white fill-current"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
                        />
                      </svg>
                    </div>
                    <div class="px-4 py-2 -mx-3">
                      <div class="mx-3">
                        <span class="font-semibold text-green-500"
                          >Success</span
                        >
                        <p class="text-sm text-gray-600">
                          {{ success }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  class="mb-2 p-5 w-full"
                  @submit.prevent="submit"
                  @reset.prevent="resetValues"
                  @change="onChangeInput"
                >
                  <div class="grid md:grid-cols-2 md:gap-6">
                    <div class="relative z-0 w-full mb-6 col-span-2">
                      <input
                        v-model="name"
                        type="text"
                        name="name"
                        id="name"
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        for="name"
                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Name</label
                      >
                    </div>
                  </div>
                  <div class="grid md:grid-cols-2 md:gap-6 mt-4">
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        v-model="region"
                        type="text"
                        name="region"
                        id="region"
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        required
                        placeholder=""
                      />
                      <label
                        for="region"
                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Region</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        v-model="state"
                        type="text"
                        name="state"
                        id="state"
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        required
                      />
                      <label
                        for="state"
                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >State</label
                      >
                    </div>
                    <div
                      class="flex flex-col space-y-2 px-2 w-full col-span-2 mb-6"
                    >
                      <label
                        for="range"
                        class="font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Low Alert Threshold<sup class="text-gray-400"
                          >*</sup
                        ></label
                      >
                      <input
                        v-model="lowThresh"
                        class="w-full"
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                      />
                      <ul class="flex justify-between w-full px-[10px]">
                        <li class="flex justify-center relative">
                          <span class="absolute">1</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">10</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">20</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">30</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">40</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">50</span>
                        </li>
                      </ul>
                    </div>
                    <div
                      class="flex flex-col space-y-2 px-2 w-full col-span-2 mb-6"
                    >
                      <label
                        for="range"
                        class="font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >High Alert Threshold<sup class="text-gray-400"
                          >*</sup
                        ></label
                      >
                      <input
                        v-model="highThresh"
                        class="w-full"
                        type="range"
                        min="51"
                        max="100"
                        step="1"
                      />
                      <ul class="flex justify-between w-full px-[10px]">
                        <li class="flex justify-center relative">
                          <span class="absolute">51</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">60</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">70</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">80</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">90</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">100</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    class="flex w-full mt-6 justify-center gap-x-6"
                    v-if="hasChanged"
                  >
                    <button
                      type="submit"
                      class="sm:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Save changes
                    </button>
                    <button
                      type="reset"
                      class="font-medium rounded-lg text-md sm:w-auto px-5 py-2.5 text-center text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50"
                    >
                      Reset Changes
                    </button>
                  </div>
                  <div class="block mt-9 text-xs text-gray-500">
                    <sup> *</sup> Threshold values indicate the minimum
                    percentage of triggered sensors required to generate the
                    relative alert
                  </div>
                </form>
              </div>
              <!-- delete section -->
              <div
                class="w-full bg-red-100 shadow-xl mx-auto my-auto rounded-lg mb-5 mt-5 gap-x-5 flex p-5"
              >
                <div class="my-4 font-medium text-md w-max">
                  Click here if you want to delete the city, but be careful,
                  this operation
                  <span class="font-bold text-lg">is not reversible</span>
                </div>

                <button
                  class="ml-auto font-medium rounded-full text-md w-fit px-3 py-2 text-center text-gray-900 bg-red-500 hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50"
                  @click="deleteCity()"
                >
                  Delete City
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
