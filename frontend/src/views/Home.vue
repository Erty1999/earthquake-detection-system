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
  citiesList.value = await store.recoverCityFromSubs(
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
                class="mt-2 px-2 text-xl font-medium text-gray-700 mx-auto text-center"
              >
                here you you will be able to see a preview of the cities you
                will follow
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
  <div v-else class="w-full p-5 flex-col">
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
      class="bg-white hover:bg-gray-100 text-center cursor-pointer shadow-xl rounded-md flex p-5 py-8"
      @click="showDetails(city)"
    >
      <!--City info-->
      <div class="xl:w-5/12 w-full flex-col text-center">
        <div class="flex">
          <div class="w-1/2 text-2xl font-medium">{{ city.name }}</div>
          <div class="w-1/2">
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
        class="xl:w-5/12 w-full overflow-x-auto overflow-y-hidden flex-col text-center"
      >
        <div class="w-fit ml-auto flex-col px-3 pt-3 rounded-lg z-1">
          <h1 class="text-lg font-medium mb-3 text-gray-800">
            Last Day Alert Levels
          </h1>
          <apexchart
            v-if="city.lastDayGraphData"
            width="500"
            height="200"
            type="line"
            :options="city.lastDayGraphData.options"
            :series="city.lastDayGraphData.series"
          ></apexchart>
          <div v-else style="width: 500px" class="pb-6">
            NO RECENT DATA AVAIBLE
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
