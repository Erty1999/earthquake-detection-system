<script setup lang="ts">
import { computed } from "vue";
import { userStore } from "../store/user";

const store = userStore();
const user = computed(() => store.user);
console.log(user.value);
</script>

<template>
  <div v-if="user?.subscriptions.length === 0" class="w-full">
    <div class="flex flex-wrap mt-8 gap-x-8 gap-y-8 w-full justify-center">
      <section class="flex-col w-full xl:w-7/12">
        <section
          class="relative w-full block rounded-t-lg"
          style="height: 300px"
        >
          <div
            class="absolute top-0 w-full h-full bg-center bg-cover rounded-t-lg"
            style="
              background-image: url('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
            "
          ></div>
        </section>
        <div class="container mx-auto">
          <div
            class="flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-b-lg"
          >
            <div class="flex flex-col text-gray-700 mt-6">
              <h2 class="text-3xl font-medium text-gray-700 mx-auto">
                Welcome {{ user.firstName }},
              </h2>
              <h2
                class="mt-2 px-2 text-xl font-medium text-gray-700 mx-auto text-center"
              >
                here you will be able to see and manage real-time notifications from the
                cities you follow. 
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
  <div v-else>mo ce se diverte</div>
</template>
