<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { userStore } from "../store/user";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();

//CITIES LIST
const citiesList = ref();
onBeforeMount(async () => (citiesList.value = await store.citiesList()));

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
          <h1 class="mx-auto mt-20 font-bold caitalize text-2xl md:text-4xl bg-opacity-50 bg-black h-fit py-2 px-1 md:px-4 rounded-lg text-center">
            Find your Cities and stay updated
          </h1>
        </div>
      </div>
    </section>
    <section class="relative py-16">
      <div class="container mx-auto px-4">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-96"
        >
          <div class="flex mt-6 w-full justify-center px-10">
            <div
              class="mb-6 overflow-hidden bg-white rounded-md shadow w-full overflow-x-auto"
            >
              <table class="w-full text-left border-collapse">
                <thead class="border-b">
                  <tr class="text-center">
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      City
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Region
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      State
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Low Treshold
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      High Treshold
                    </th>

                    <th class="bg-indigo-800"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(i, index) in citiesList"
                    :key="index"
                    class="hover:bg-gray-100 text-center cursor-pointer"
                    @click="showDetails(i)"
                  >
                   
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                      {{ i.name }}
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                      {{ i.region }}
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                      {{ i.state }}
                    </td>
                    <td class="px-6 py-4 border-b">
                      <span
                        class="text-yellow-800 bg-yellow-100 rounded-full p-3"
                        >{{ i.lowThresh }}%</span
                      >
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                      <span class="text-red-800 bg-red-100 rounded-full p-3"
                        >{{ i.highThresh }}%</span
                      >
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
                        class="text-white bg-indigo-600 p-2 rounded-lg flex gap-x-1 my-2 z-20"
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
