<script setup lang="ts">
import { ref } from "vue";
import useAxios from "../composables/useAxios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/20/solid";

const currentDate = ref(new Date().toISOString().slice(0, 10));

const firstName = ref("");
const lastName = ref("");
const birthday = ref("");
const email = ref("");
const pwd = ref("");
const pwdConf = ref("");
const telNumber = ref("");
const telegramID = ref("");

const showPwd = ref(false);
const showPwdConf = ref(false);

const error = ref("");
const isLoading = ref(true);
const items = ref();

//Function that parse number value in a +xx xxx xxx xxxx format
function acceptNumber(e: InputEvent | any) {
  let x = telNumber.value
    .replace(/\D/g, "")
    .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})/);

  telNumber.value = !x![2]
    ? x![1]
    : "+" + x![1] + " " + x![2] + " " + x![3] + (x![4] ? " " + x![4] : "");

  if (x![1] && x![2] && !x![3] && e.inputType === "deleteContentBackward") {
    telNumber.value = telNumber.value.slice(0, -1);
  }
}

//Function that manage the show/unshow passwords interactions
function show(type: number) {
  if (type === 1) {
    showPwd.value = !showPwd.value;
    return;
  }
  showPwdConf.value = !showPwdConf.value;
}

//Function that manage the submit event
async function submit() {
  error.value = "";

  //check possible input errors
  if (pwd.value != pwdConf.value) {
    error.value = "Passwords do not match";
    return;
  }
  //Reparse tel number format
  let telnumberParsed = "";
  if (telNumber.value) {
    telnumberParsed = telNumber.value.slice(1).replace(/\s+/g, "");
  }
  //Register the new user
  useAxios()
    .post("/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      birthday: birthday.value,
      email: email.value,
      pwd: pwd.value,
      pwdConf: pwdConf.value,
      telNumber: telnumberParsed,
      telegramUserID: telegramID.value,
    })
    .then((response) => {
      items.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
      console.log(items.value);
    });
}
</script>

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
          <div
            v-if="error"
            class="w-fit p-2 mx-auto my-4 rounded-md bg-red-500"
          >
            {{ error }}
          </div>

          <form
            class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
            @submit.prevent="submit"
          >
            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >First Name</label
              >
              <input
                v-model="firstName"
                type="text"
                placeholder="John"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Last name</label
              >
              <input
                v-model="lastName"
                type="text"
                placeholder="Snow"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Birthday</label
              >
              <input
                v-model="birthday"
                v-bind:max="currentDate"
                type="date"
                placeholder=" "
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Email address</label
              >
              <input
                v-model="email"
                type="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                placeholder="johnsnow@example.com"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Password</label
              >
              <div class="w-full flex bg-gray-400 rounded-lg">
                <input
                  v-if="!showPwd"
                  v-model="pwd"
                  type="password"
                  title=" the password must contains at least 8 characters, an uppercase letter and a digit"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  placeholder="Enter your password"
                  class="block px-5 py-3 w-10/12 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-l-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
                <input
                  v-else
                  v-model="pwd"
                  type="text"
                  title=" the password must contains at least 8 characters, an uppercase letter and a digit"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  placeholder="Enter your password"
                  class="block px-5 py-3 w-10/12 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-l-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
                <div
                  class="grow flex justify-center cursor-pointer"
                  @click="show(1)"
                >
                  <EyeIcon
                    v-if="!showPwd"
                    class="w-6 text-gray-800 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  <EyeSlashIcon
                    v-else
                    class="w-6 text-gray-800 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Confirm password</label
              >
              <div class="w-full flex bg-gray-400 rounded-lg">
                <input
                  v-if="!showPwdConf"
                  v-model="pwdConf"
                  type="password"
                  title=" the password must contains at least 8 characters, an uppercase letter and a digit"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  placeholder="Enter your password"
                  class="block px-5 py-3 w-10/12 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-l-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
                <input
                  v-else
                  v-model="pwdConf"
                  type="text"
                  title=" the password must contains at least 8 characters, an uppercase letter and a digit"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  placeholder="Enter your password"
                  class="block px-5 py-3 w-10/12 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-l-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
                <div
                  class="grow flex justify-center cursor-pointer"
                  @click="show(2)"
                >
                  <EyeIcon
                    v-if="!showPwdConf"
                    class="w-6 text-gray-800 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  <EyeSlashIcon
                    v-else
                    class="w-6 text-gray-800 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Phone number</label
              >
              <input
                type="tel"
                pattern="[+][0-9]{2}[ ][0-9]{3}[ ][0-9]{3}[ ][0-9]{4}"
                placeholder="+xx xxx xxx xxxx"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                v-model="telNumber"
                @input="acceptNumber"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                >Telegram User ID</label
              >
              <input
                v-model="telegramID"
                type="text"
                placeholder="Enter your password"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div class="flex md:col-span-2 mt-5">
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
