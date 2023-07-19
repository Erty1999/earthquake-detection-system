<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { userStore } from "../store/user";
import { PlusCircleIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();

//CITIES LIST
const citiesList = ref();
onBeforeMount(async () => {
  citiesList.value = await store.citiesList();
});

//Function that manage the subscription
async function follow(city: any) {
  let error;
  await store.subscription(city?.id).catch((e) => {
    error = e;
  });
  if (error) return;
  citiesList.value = await store.citiesList();
}

//Function that manage the unsubscription
async function unfollow(city: any) {
  let error;
  await store.unSubscription(city?.id).catch((e) => {
    error = e;
  });
  if (error) return;
  citiesList.value = await store.citiesList();
}

//Function that redirect the user to the page of the city
async function showDetails(city: any) {
  router.push("/" + city.state + "/" + city.name);
  return;
}

//Research city
let searchBar = ref("");
function filteredList() {
  return citiesList?.value?.filter((city: any) =>
    city.name.toLowerCase().includes(searchBar.value.toLowerCase())
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
      <div
        class="absolute top-0 w-full h-full bg-center bg-cover rounded-t-lg"
        style="
          background-image: url('https://images.unsplash.com/photo-1545044846-351ba102b6d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80');
        "
      >
        <div
          id="blackOverlay"
          class="w-full h-full absolute bg-opacity-60 bg-black rounded-t-lg text-white flex"
        >
          <h1
            class="mx-auto mt-20 font-bold caitalize text-2xl md:text-4xl h-fit py-2 px-1 md:px-4 rounded-lg text-center"
          >
            Find your Cities and stay updated
          </h1>
        </div>
      </div>
    </section>
    <section class="relative py-16">
      <div class="container mx-auto px-4 md:px-10 2xl:px-52">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-96"
        >
          <div class="flex mt-6 w-full justify-center px-10">
            <div
              class="mb-6 overflow-hidden bg-white rounded-md w-full overflow-x-auto flex-col justify-center"
            >
              <div class="w-full lg:w-1/2 flex mx-auto">
                <div class="relative mt-4 mb-2 w-full">
                  <input
                    v-model="searchBar"
                    type="text"
                    placeholder="Search a city name"
                    class="w-full rounded-lg border border-gray-300 bg-gray-100 py-1.5 pl-10 pr-4 text-gray-700 placeholder-gray-500 rtl:pr-11 rtl:pl-4"
                  />
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-500" />
                  </span>
                </div>
              </div>
              <table class="w-full border-separate border-spacing-y-4">
                <tbody>
                  <tr
                    v-for="(i, index) in filteredList()"
                    :key="index"
                    class="bg-gray-100 hover:bg-gray-200 text-center cursor-pointer shadow-md"
                    @click="showDetails(i)"
                  >
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                      {{ i.name }}
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                      <div class="text-sm font-medium leading-5 text-gray-900">
                        {{ i?.state }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        {{ i?.region }}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                      <div class="text-sm font-medium leading-5 text-gray-900">
                        {{ i?.lastUpdate?.activeSensors || 0 }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        Active Sensors
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                      <div
                        v-if="!i?.lastUpdate?.alertLevel"
                        class="flex flex-col text-gray-800 bg-gray-300 rounded-full p-3 w-fit mx-auto"
                      >
                        No Data
                      </div>
                      <div
                        v-if="i?.lastUpdate?.alertLevel === 'none'"
                        class="flex text-green-900 bg-green-200 rounded-full p-1 px-3 w-fit mx-auto"
                      >
                        Pacific
                      </div>
                      <div
                        v-if="i?.lastUpdate?.alertLevel === 'low'"
                        class="flex text-orange-800 bg-orange-100 rounded-full p-1 px-3 w-fit mx-auto"
                      >
                        Low Alert
                      </div>
                      <div
                        v-if="i?.lastUpdate?.alertLevel === 'high'"
                        class="flex text-red-800 bg-red-200 rounded-full p-1 px-3 w-fit mx-auto"
                      >
                        High Alert
                      </div>
                      <div
                        v-if="i?.lastUpdate?.alertLevel"
                        class="text-sm leading-5 text-gray-500"
                      >
                        at {{ convertDate(i?.lastUpdate?.createdAt) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 border-b flex justify-center">
                      <button
                        v-if="i.isSubscribed"
                        class="text-white bg-red-500 p-2 rounded-lg flex gap-x-1 my-2 z-2 px-2.5"
                        @click="
                          (event) => {
                            unfollow(i);
                            event.stopPropagation();
                          }
                        "
                      >
                        Unfollow
                      </button>

                      <button
                        v-else
                        class="text-white bg-indigo-600 p-2 rounded-lg flex gap-x-1 my-2 z-2"
                        @click="
                          (event) => {
                            follow(i);
                            event.stopPropagation();
                          }
                        "
                      >
                        <PlusCircleIcon class="w-5" />
                        Follow
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
