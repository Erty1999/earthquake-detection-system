<script setup lang="ts">
import { ref, onBeforeMount, toRaw } from "vue";
import { User, userStore } from "../../store/user";
import { adminStore } from "../../store/admin";
import {
  UserPlusIcon,
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/outline";

const store = adminStore();

const currentDate = ref(new Date().toISOString().slice(0, 10));

const firstName = ref("");
const lastName = ref("");
const birthday = ref("");
const email = ref("");
const telNumber = ref("");
const telegramID = ref("");
const pwd = ref("");
const pwdConf = ref("");

const showPwd = ref(false);
const showPwdConf = ref(false);
const hasChanged = ref(false);

const error = ref("");
const success = ref("");

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
  success.value = "";

  //check possible input errors
  if (pwdConf.value && !pwd.value) {
    error.value = "Passwords do not match";
    return;
  }
  if (pwd.value && pwd.value != pwdConf.value) {
    error.value = "Passwords do not match";
    return;
  }

  //Reparse tel number format
  let telnumberParsed = "";
  if (telNumber.value) {
    telnumberParsed = telNumber.value.slice(1).replace(/\s+/g, "");
  }

  //New user istance
  const newUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    birthday: birthday.value,
    email: email.value,
    telNumber: telnumberParsed,
    telegramUserID: telegramID.value,
  } as User;

  //User Creation by admin
  const response = await store.createUser(newUser, pwd.value).catch((e) => {
    error.value =
      e?.response?.data?.message ??
      "Internal server error, please try again...";
  });

  if (error.value) return;

  //Clean the form
  resetValues();

  //Add the new user into the list
  usersList.value.unshift(response);

  //Show success message
  success.value = "User correctly created ";

  hasChanged.value = false;
}

function resetValues() {
  firstName.value = "";
  lastName.value = "";
  birthday.value = "";
  email.value = "";
  telNumber.value = "";
  telegramID.value = "";
  pwd.value = "";
  pwdConf.value = "";

  showPwd.value = false;
  showPwdConf.value = false;

  error.value = "";
  hasChanged.value = false;
}

function onChangeInput() {
  hasChanged.value = true;
  error.value = "";
  success.value = "";
}

//USER LIST
const usersList = ref();
const storeUser = userStore();
onBeforeMount(async () => (usersList.value = await store.usersList()));

//Function that update the role of the new Admin
async function makeAdmin(user: any) {
  user.isAdmin = true;
  let newAdmin = toRaw(user);
  newAdmin.isAdmin = true;
  await storeUser.updateUser(newAdmin, "");
  return;
}
</script>

<template>
  <div class="w-full">
    <div class="flex flex-wrap mt-8 gap-x-8 gap-y-8 w-full justify-center">
      <section class="flex w-full xl:w-4/12">
        <div class="container mx-auto">
          <div
            class="flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg"
          >
            <div class="px-6">
              <div class="flex text-gray-700 mt-6 ml-5 mb-2 items-center">
                <UserPlusIcon
                  class="h-12 rounded-full p-2 bg-blue-600 text-white"
                />
                <h2 class="text-3xl font-medium text-gray-700 ml-3">
                  Create New User
                </h2>
              </div>
              <div class="flex justify-center">
                <div
                  class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-slate-200 rounded-lg shadow-md my-4"
                  v-if="error"
                >
                  <div class="flex items-center justify-center w-12 bg-red-500">
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
                      <span class="font-semibold text-green-500">Success</span>
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
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="firstName"
                      type="text"
                      name="first_name"
                      id="first_name"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="first_name"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >First Name</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="lastName"
                      type="text"
                      name="last_name"
                      id="last_name"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="last_name"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Last Name</label
                    >
                  </div>
                </div>
                <div class="grid md:grid-cols-2 md:gap-6 mt-4">
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="birthday"
                      v-bind:max="currentDate"
                      type="date"
                      name="birthday"
                      id="birthday"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      required
                    />
                    <label
                      for="birthday"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Birthday</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="email"
                      type="text"
                      name="email"
                      id="email"
                      pattern="[a-z0-9A-Z._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="floating_last_name"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Email Address</label
                    >
                  </div>
                </div>

                <div class="grid md:grid-cols-2 md:gap-6 mt-4">
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      type="tel"
                      pattern="[+][0-9]{2}[ ][0-9]{3}[ ][0-9]{3}[ ][0-9]{4}"
                      name="telNumber"
                      id="telNumber"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      v-model="telNumber"
                      placeholder=" "
                      @input="acceptNumber"
                    />
                    <label
                      for="telNumber"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Phone number</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="telegramID"
                      type="text"
                      name="telegramID"
                      id="telegramID"
                      class="block py-2.5 px-0 w-full text-sm text-gsubmitray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      for="telegramID"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Telegram User ID</label
                    >
                  </div>
                </div>
                <div class="grid md:grid-cols-2 md:gap-6 mt-4">
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="pwd"
                      v-bind:type="showPwd ? 'text' : 'password'"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                      name="pwd"
                      id="pwd"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <div
                      class="absolute top-3 right-0 cursor-pointer"
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
                    <label
                      for="pwd"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Password</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="pwdConf"
                      v-bind:type="showPwdConf ? 'text' : 'password'"
                      name="pwdConf"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Confirm password"
                      id="pwdConf"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <div
                      class="absolute top-3 right-0 cursor-pointer"
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
                    <label
                      for="pwdConf"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Confirm Password</label
                    >
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
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- SECOND SECTION : LIST -->
      <section class="flex flex-col w-full xl:w-7/12">
        <div
          class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div
            class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg bg-gray-50"
          >
            <div class="flex text-gray-700 mt-6 ml-5 mb-5 items-center">
              <UserGroupIcon
                class="h-12 rounded-full p-2 bg-pink-600 text-white"
              />
              <h2 class="text-3xl font-medium text-gray-700 ml-3">
                Users List
              </h2>
            </div>
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    birthday
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    Role
                  </th>

                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr v-for="(user, index) in usersList" :key="index">
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        <img
                          v-if="user?.avatar"
                          v-bind:src="user?.avatar"
                          class="object-cover shadow-xl rounded-full h-10 w-10 align-middle  border-none bg-gray-300"
                          style="max-width: 150px"
                        />
                        <UserCircleIcon
                          v-else
                          class="shadow-xl rounded-full w-10 h-10 align-middle border-none  text-gray-600 bg-gray-300"
                        />
                      </div>

                      <div class="ml-4">
                        <div
                          class="text-sm font-medium leading-5 text-gray-900"
                        >
                          {{ user?.firstName }}
                          {{ user?.lastName }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="text-sm leading-5 text-gray-900">
                      {{ user?.email }}
                    </div>
                  </td>

                  <td
                    class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                  >
                    {{ user?.birthday }}
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <span
                      v-if="user?.isAdmin"
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full"
                      >ADMIN</span
                    >
                  </td>

                  <td
                    class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                  >
                    <button
                      v-if="!user?.isAdmin"
                      @click="makeAdmin(user)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Make Admin
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
