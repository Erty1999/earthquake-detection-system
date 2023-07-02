<script setup lang="ts">
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import useAxios from "../composables/useAxios";
const isLoading = ref(true);
const items = ref();

useAxios()
  .get("/")
  .then((response) => {
    items.value = response.data;
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    isLoading.value = false;
    console.log(toRaw(items.value));
  });

const router = useRouter();
// const email = ref("johndoe@mail.com");
// const password = ref("@#!@#asdf1231!_!@#");

function login() {
  router.push("/dashboard");
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="flex justify-center h-screen">
      <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div class="flex-1">
          <div class="flex justify-center mx-auto">
            <img class="w-60 h-65" src="/public/logo.png" alt="" />
          </div>

          <div class="mt-20">
            <form @submit.prevent="login">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-md text-gray-600 dark:text-gray-200"
                  >Email Address</label
                >
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@example.com"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div class="mt-6">
                <div class="flex justify-between mb-2">
                  <label
                    for="password"
                    class="text-md text-gray-600 dark:text-gray-200"
                    >Password</label
                  >
                </div>

                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div class="mt-6">
                <button
                  class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p class="mt-6 text-md text-center text-gray-400">
              Don&#x27;t have an account yet?
              <a
                href="register"
                class="text-blue-500 focus:outline-none focus:underline hover:underline"
                >Sign up</a
              >.
            </p>
          </div>
        </div>
      </div>

      <div
        class="hidden bg-cover lg:block lg:w-2/3"
        style="
          background-image: url(https://images.unsplash.com/photo-1635068741358-ab1b9813623f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2060&q=80);
        "
      >
        <div class="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
          <div class="flex ml-auto h-[65vh]">
            <div class="bg-black bg-opacity-75 rounded-md mt-auto p-8">
              <h2 class="text-2xl font-bold text-white sm:text-3xl">
                Earthquake Control
              </h2>

              <p class="max-w-xl mt-3 text-gray-300 text-lg">
                This service provides real-time alerts and information about
                earthquakes happening around the world. With our service, you
                can also stay informed about previous seismic activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
