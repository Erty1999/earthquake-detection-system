<script setup lang="ts"></script>

<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="flex justify-center min-h-screen">
      <div
        class="hidden bg-cover lg:block lg:w-2/5"
        style="
          background-image: url('https://images.unsplash.com/photo-1603869311144-66b03d340b32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=751&q=80');
        "
      ></div>

      <div
        class="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5"
      >
        <div class="w-full">
          <div class="flex justify-center mx-auto">
            <img class="w-60 h-65 mb-5" src="/public/logo.png" alt="" />
          </div>
          <h1
            class="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white text-center"
          >
            Get your free account
          </h1>

          <form class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >First Name</label
              >
              <input
                type="text"
                placeholder="John"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Last name</label
              >
              <input
                type="text"
                placeholder="Snow"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Phone number</label
              >
              <input
                type="text"
                placeholder="XXX-XX-XXXX-XXX"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Email address</label
              >
              <input
                type="email"
                placeholder="johnsnow@example.com"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Password</label
              >
              <input
                type="password"
                placeholder="Enter your password"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Confirm password</label
              >
              <input
                type="password"
                placeholder="Enter your password"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div class="flex col-span-2 mt-5 ">
              <button
                class="flex items-center m-auto justify-between gap-x-4 pl-6 pr-4 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                <span class="text-md font-semibold">Sign Up </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 rtl:-scale-x-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
