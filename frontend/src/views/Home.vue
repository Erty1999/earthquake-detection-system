<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { userStore } from "../store/user";

import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const citiesList = ref();
let searchBar = ref("");

const store = userStore();
const router = useRouter();
const user = computed(() => store.user);

//CITIES LIST
onBeforeMount(async () => {
  citiesList.value = await store.recoverCitiesFromSubs(
    user.value?.subscriptions as any
  );
});

//Research city
function filteredList() {
  return citiesList?.value?.filter((city: any) =>
    city.name.toLowerCase().includes(searchBar.value.toLowerCase())
  );
}

//Function that redirect the user to the page of the city
async function showDetails(city: any) {
  router.push("/" + city.state + "/" + city.name);
  return;
}

//Function that manage the unsubscription
async function unfollow(city: any) {
  let error;
  await store.unSubscription(city?.id).catch((e) => {
    error = e;
  });
  if (error) return;
  //Remove the city from the list
  citiesList.value = citiesList.value.filter((obj: any) => obj.id != city.id);
}

function convertDate(time: any) {
  const date = new Date(+time);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
}
</script>

<template>
  <div v-if="citiesList?.length === 0" class="w-full">
    <div class="flex flex-wrap mt-8 gap-x-8 gap-y-8 w-full justify-center">
      <section class="flex-col w-full xl:w-7/12">
        <section
          class="relative w-full block rounded-t-lg"
          style="height: 300px"
        >
          <div
            class="absolute top-0 w-full h-full bg-center bg-cover rounded-t-lg"
            style="
              background-image: url('https://images.unsplash.com/photo-1604472781388-370451e4b1cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
            "
          ></div>
        </section>
        <div class="container mx-auto">
          <div
            class="flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-b-lg"
          >
            <div class="flex flex-col text-gray-700 mt-6">
              <h2 class="text-3xl font-medium text-gray-700 mx-auto">
                Welcome {{ user?.firstName }},
              </h2>
              <h2
                class="mt-2 px-2 text-2xl font-medium text-gray-700 mx-auto text-center"
              >
                here you will be able to see a preview of the cities you will
                follow
              </h2>
              <div class="text-md text-gray-800 mx-4 mt-6 text-center mb-6">
                find your favorite cities
                <a class="underline text-blue-500" href="/Cities">here</a>,
                follow them and stay updated
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div v-else class="w-full p-5 xl:px-16">
    <!--Search Bar-->
    <div class="w-full lg:w-1/2 flex mx-auto mb-7">
      <div class="relative mt-4 mb-2 w-full">
        <input
          v-model="searchBar"
          type="text"
          placeholder="Search a city name"
          class="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-10 pr-4 text-gray-700 placeholder-gray-500 rtl:pr-11 rtl:pl-4"
        />
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-500" />
        </span>
      </div>
    </div>
    <!--City List-->
    <div
      v-for="(city, index) in filteredList()"
      :key="index"
      class="bg-white hover:bg-gray-100 cursor-pointer shadow-xl rounded-md w-full my-8"
      @click="showDetails(city)"
    >
      <!--name/location-->
      <div class="w-full flex flex-wrap">
        <div
          class="w-full rounded-t-md 2xl:rounded-tr-none 2xl:pt-0 2xl:w-1/6 2xl:rounded-l-md bg-slate-300 flex"
        >
          <div class="flex flex-col m-auto text-center capitalize pt-5">
            <span class="text-3xl font-medium text-gray-800">{{
              city?.name
            }}</span>
            <div class="px-6 py-3 text-gray-500">
              <div class="text-sm font-medium text-gray-900">
                {{ city?.state }}
              </div>
              <div class="text-sm text-gray-600">
                {{ city?.region }}
              </div>
            </div>
            <!--unfollow button-->
            <div class="w-full flex mb-3 2xl:mb-0 2xl:pb-5">
              <button
                class="text-white bg-red-500 p-2 rounded-lg flex px-2.5 m-auto"
                @click="
                  (event) => {
                    unfollow(city);
                    event.stopPropagation();
                  }
                "
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
        <!--Graph last day info-->
        <div
          class="w-max overflow-x-auto overflow-y-hidden text-center flex m-auto 2xl:ml-5"
        >
          <div class="w-max px-3 pt-3 rounded-lg z-1 mt-3 2xl:mt-0">
            <span class="text-md text-gray-700"> Last Day Alert Levels </span>
            <apexchart
              v-if="city.lastDayGraphData"
              width="500"
              height="200"
              type="line"
              :options="city.lastDayGraphData.options"
              :series="city.lastDayGraphData.series"
            ></apexchart>
            <div v-else style="width: 500px" class="mt-1 pb-3">
              NO RECENT DATA AVAIBLE
            </div>
          </div>
        </div>
        <div
          class="grow text-center flex mx-auto flex-wrap mb-5 2xl:mb-0 mt-4 2xl:mt-0"
        >
          <!--last update-->
          <div class="flex w-1/2 m-auto text-center justify-center">
            <div class="w-full px-4 flex-col text-center text-gray-700">
              Last Update:
              <div
                v-if="!city?.lastUpdate?.alertLevel"
                class="flex flex-col text-gray-800 bg-gray-300 rounded-full px-3 py-1 w-fit mx-auto mt-0.5"
              >
                No Data
              </div>

              <div
                v-if="city?.lastUpdate?.alertLevel === 'pacific'"
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
          <!--active sensors-->
          <div class="flex w-1/2 m-auto text-center justify-center">
            <div>
              <span
                class="text-xl font-bold block uppercase tracking-wide text-gray-800"
                >{{ city?.lastUpdate?.activeSensors ?? "0" }}</span
              ><span class="text-sm text-gray-500">Active Sensors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
