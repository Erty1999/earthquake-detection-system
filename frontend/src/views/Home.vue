<script setup lang="ts">
import { computed } from "vue";
import { userStore } from "../store/user";
import { FaceFrownIcon } from "@heroicons/vue/24/outline";

const store = userStore();
const user = computed(() => store.user);
console.log(user.value);
</script>

<template>
  <div v-if="user?.subscriptions.length === 0" class="w-full">
    <div class="flex flex-wrap mt-8 gap-x-8 gap-y-8 w-full justify-center">
      <section class="flex w-full xl:w-4/12">
        <div class="container mx-auto">
          <div
            class="flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg"
          >
            <div class="flex flex-col text-gray-700 mt-6">
              <FaceFrownIcon class="w-10 h-10 mx-auto mb-4" />
              <h2 class="text-3xl font-medium text-gray-700 mx-auto">Oops,</h2>
              <h2 class="text-2xl font-medium text-gray-800 mx-auto text-center">
                it looks like you don't follow any city
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
