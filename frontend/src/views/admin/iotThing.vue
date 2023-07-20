<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { City, adminStore } from "../../store/admin";
import {
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  ArrowUpTrayIcon,
  CubeTransparentIcon,
  Squares2X2Icon,
  SquaresPlusIcon,
  StopIcon,
  CubeIcon,
} from "@heroicons/vue/24/outline";

const store = adminStore();

const name = ref("");
const region = ref("");
const state = ref("");
const lowThresh = ref(26);
const highThresh = ref(76);
const shadowClientID = ref("");
const shadowPrivateKey = ref(null);
const shadowCertificate = ref(null);
//const shadowEndpoint = ref(null);

const error = ref("");
const success = ref("");
const hasChanged = ref(false);

function uploadFile(field: string) {
  eval(field).value.click();
}

async function fileUploader(field: any) {
  error.value = "";
  const file = eval(field).value.files[0];

  //Type check
  // const acceptedFileTypes = ["pem"];
  // if (!acceptedFileTypes.some((t) => file.type.includes(t))) {
  //   error.value = "File type not accepted, you can only upload .pem files.";
  //   return;
  // }

  const path = await store.uploadFile(file).catch((e: any) => {
    error.value = e;
  });

  if (error.value) {
    return;
  }

  //Update user info
  eval(field).value = path;
}

//Function that manage the submit event
async function submit() {
  error.value = "";
  success.value = "";

  //check possible input errors
  if (!name.value || !region.value || !state.value) {
    error.value = "Please complete all fields";
    return;
  }

  //New city istance
  const newCity = {
    name: name.value,
    region: region.value,
    state: state.value,
    lowThresh: lowThresh.value,
    highThresh: highThresh.value,
  } as City;

  //City Creation by admin
  const response = await store.createCity(newCity).catch((e) => {
    error.value =
      e?.response?.data?.message ??
      "Internal server error, please try again...";
  });

  if (error.value) return;

  //Clean the form
  resetValues();

  //Add the new user into the list
  citiesList.value.unshift(response);

  //Show success message
  success.value = "City correctly created";

  hasChanged.value = false;
}

function resetValues() {
  name.value = "";
  region.value = "";
  state.value = "";
  lowThresh.value = 26;
  highThresh.value = 76;

  error.value = "";
  success.value = "";
  hasChanged.value = false;
}

function onChangeInput() {
  hasChanged.value = true;
  error.value = "";
  success.value = "";
}

//CITIES LIST
const citiesList = ref();
onBeforeMount(async () => (citiesList.value = await store.citiesList()));

//Function that redirect the admin to the page of the city
async function showDetails(city: any) {
  //TODO: redirect to the page of the city
  console.log(city);
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
                <SquaresPlusIcon
                  class="h-12 rounded-full p-2 bg-blue-600 text-white"
                />
                <h2 class="text-3xl font-medium text-gray-700 ml-3">
                  Add New IoT Device
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
                      v-model="name"
                      type="text"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      required
                      placeholder=""
                    />
                    <label
                      for="name"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Name</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      v-model="type"
                      type="text"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=""
                      required
                    />
                    <label
                      for="state"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >IoT thing Type</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 col-span-2">
                    <input
                      v-model="location"
                      type="text"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="location"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Location</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 col-span-2">
                    <input
                      v-model="city"
                      type="text"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="city"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >City</label
                    >
                  </div>
                </div>
                <div class="mt-6 font-bold text-sm text-gray-500">
                  <span>AWS IoT Shadow Section</span>
                </div>
                <div class="grid md:grid-cols-2 md:gap-6 mt-3">
                  <div class="relative z-0 w-full mb-6 col-span-2">
                    <input
                      v-model="shadowClientID"
                      type="text"
                      name="shadowClientID"
                      id="shadowClientID"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="shadowClientID"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Client ID
                    </label>
                  </div>
                </div>
                <div class="w-full inline-flex">
                  <div class="w-fit mt-2">Private Key File :</div>
                  <div class="flex justify-center ml-5">
                    <div
                      class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2 cursor-pointer"
                      @click="uploadFile('shadowPrivateKey')"
                    >
                      <ArrowUpTrayIcon class="m-auto h-5 w-5 text-gray-900" />
                      <input
                        ref="shadowPrivateKey"
                        type="file"
                        id="shadowPrivateKey"
                        hidden
                        @change="fileUploader('shadowPrivateKey')"
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full inline-flex mt-2">
                  <div class="w-fit mt-2">Certificate File :</div>
                  <div class="flex justify-center ml-5">
                    <div
                      class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2 cursor-pointer ml-1"
                      @click="uploadFile('shadowCertificate')"
                    >
                      <ArrowUpTrayIcon class="m-auto h-5 w-5 text-gray-900" />
                      <input
                        ref="shadowCertificate"
                        type="file"
                        id="shadowCertificate"
                        hidden
                        @change="fileUploader('shadowCertificate')"
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full inline-flex mt-2">
                  <div class="w-fit mt-2">Certificate File :</div>
                  <div class="flex justify-center ml-5">
                    <div
                      class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2 cursor-pointer ml-1"
                      @click="uploadFile('shadowCertificate')"
                    >
                      <ArrowUpTrayIcon class="m-auto h-5 w-5 text-gray-900" />
                      <input
                        ref="shadowCertificate"
                        type="file"
                        id="shadowCertificate"
                        hidden
                        @change="fileUploader('shadowCertificate')"
                      />
                    </div>
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
              <Squares2X2Icon
                class="h-12 rounded-full p-2 bg-pink-600 text-white"
              />
              <h2 class="text-3xl font-medium text-gray-700 ml-3">
                IoT Devices List
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
                    Location
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    Low T.
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    High T.
                  </th>

                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr v-for="(city, index) in citiesList" :key="index">
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        <CubeIcon
                          class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-gray-600 bg-gray-300 p-1"
                        />
                      </div>

                      <div class="ml-4">
                        <div
                          class="text-sm font-medium leading-5 text-gray-900"
                        >
                          {{ city?.name }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="text-sm font-medium leading-5 text-gray-900">
                      {{ city?.state }}
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ city?.region }}
                    </div>
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <span
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full"
                      >{{ city?.lowThresh }}%</span
                    >
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <span
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full"
                      >{{ city?.highThresh }}%</span
                    >
                  </td>

                  <td
                    class="pr-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                  >
                    <button
                      @click="showDetails(city)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
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