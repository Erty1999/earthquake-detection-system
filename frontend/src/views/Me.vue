<script setup lang="ts">
import { ref, computed } from "vue";
import { userStore, User } from "../store/user";

import {
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
  ArrowUpTrayIcon,
} from "@heroicons/vue/24/outline";

const store = userStore();
const user = computed(() => store.user);

const currentDate = ref(new Date().toISOString().slice(0, 10));

const firstName = ref(user.value?.firstName ?? "");
const lastName = ref(user.value?.lastName ?? "");
const birthday = ref(user.value?.birthday ?? "");
const email = ref(user.value?.email ?? "");
const telNumber = ref(user.value?.telNumber ?? "");
const telegramID = ref(user.value?.telegramUserID ?? "");
const pwd = ref("");
const pwdConf = ref("");

const showPwd = ref(false);
const showPwdConf = ref(false);
const hasChanged = ref(false);

const error = ref("");
const success = ref("");

const userAvatar = ref(null);

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

//Initial telNumbet parsing
acceptNumber(null);

//Function that manage the show/unshow passwords interactions
function show(type: number) {
  if (type === 1) {
    showPwd.value = !showPwd.value;
    return;
  }
  showPwdConf.value = !showPwdConf.value;
}
function resetValues() {
  firstName.value = user.value?.firstName ?? "";
  lastName.value = user.value?.lastName ?? "";
  birthday.value = user.value?.birthday ?? "";
  email.value = user.value?.email ?? "";
  telNumber.value = user.value?.telNumber ?? "";
  telegramID.value = user.value?.telegramUserID ?? "";
  pwd.value = "";
  pwdConf.value = "";

  showPwd.value = false;
  showPwdConf.value = false;

  acceptNumber(null);
  error.value = "";
  hasChanged.value = false;
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
    id: user.value?.id,
    firstName: firstName.value,
    lastName: lastName.value,
    birthday: birthday.value,
    email: email.value,
    telNumber: telnumberParsed,
    telegramUserID: telegramID.value,
  } as User;

  //Update function call
  const response = await store.updateUser(newUser, pwd.value).catch((e) => {
    error.value =
      e.response.data.message ?? "Internal server error, please try again...";
  });

  if (error.value) return;

  //Update stored user info
  store.user = response as any as User;
  pwd.value = "";
  pwdConf.value = "";

  //Show success message
  success.value = "Information successfully updated";

  hasChanged.value = false;
}

function uploadAvatar() {
  (userAvatar as any).value.click();
}

async function avatarUploader() {
  error.value = "";
  const file = (userAvatar as any).value.files[0];

  //Type check
  const acceptedFileTypes = ["jpeg", "png", "gif", "svg", "ico", "tiff", "dvu"];
  if (!acceptedFileTypes.some((t) => file.type.includes(t))) {
    error.value = "File type not accepted, you can only upload image files.";
    return;
  }

  const image = await store.uploadAvatar(file).catch((e: any) => {
    if (e?.response?.status === 413){
      error.value = "File too large (max 10mb)"
      return
    }
    error.value = e;
  });

  if (error.value) {
    hasChanged.value = false;
    return;
  }

  const user = store.user as User;
  user.avatar = image as any;

  //Update user info
  await store.updateUser(user, pwd.value).catch((e) => {
    error.value =
      e?.response?.data?.message ??
      "Internal server error, please try again...";
  });

  if (error.value) return;

  hasChanged.value = false;
}
</script>

<template>
  <div class="rounded-t-lg">
    <section class="relative block rounded-t-lg" style="height: 500px">
      <div
        class="absolute top-0 w-full h-full bg-center bg-cover rounded-t-lg"
        style="
          background-image: url('https://images.unsplash.com/photo-1609568175100-55a3902e3188?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80');
        "
      >
        <div
          id="blackOverlay"
          class="w-full h-full absolute bg-opacity-60 bg-black rounded-t-lg text-white flex"
        >
          <h1 class="mx-auto mt-36 font-bold caitalize text-2xl md:text-4xl">
            {{ user?.firstName ?? "User" }}
            {{ user?.lastName ?? "Name" }} Profile
          </h1>
        </div>
      </div>
    </section>

    <section class="relative py-16">
      <div class="container mx-auto px-4">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
        >
          <div class="px-6">
            <div class="flex flex-wrap justify-center mb-20">
              <div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                <div class="relative">
                  <img
                    v-if="user?.avatar"
                    v-bind:src="user?.avatar?.data"
                    class="object-cover shadow-xl rounded-full h-32 w-32 align-middle absolute -m-16 -ml-18 lg:-ml-20 border-2 border-gray-900 bg-gray-300"
                    style="max-width: 150px"
                  />
                  <UserCircleIcon
                    v-else
                    class="shadow-xl rounded-full h-32 align-middle border-none absolute -m-16 -ml-18 lg:-ml-20 text-gray-900 bg-gray-300"
                  />
                </div>
              </div>
            </div>

            <div class="w-full flex justify-center mb-5">
              <div
                class="-mt-14 ml-20 z-10 bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2 border-2 border-gray-900 cursor-pointer"
                @click="uploadAvatar"
              >
                <ArrowUpTrayIcon class="m-auto h-5 w-5 text-gray-900" />
                <input
                  ref="userAvatar"
                  type="file"
                  id="avatar"
                  hidden
                  @change="avatarUploader"
                  accept="image/png, image/jpeg, image/gif, image/svg, image/ico, image/tiff, image/dvu"
                />
              </div>
            </div>
            <div class="flex justify-center">
              <div
                class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-slate-200 rounded-lg shadow-md mb-4"
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
                <div class="flex items-center justify-center w-12 bg-green-500">
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
              @change="
                () => {
                  hasChanged = true;
                }
              "
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
                    >Phone number (+xx xxx xxx xxxx)</label
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
  </div>
</template>
