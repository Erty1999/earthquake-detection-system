<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { adminStore } from "../../store/admin";
import {
  ArrowUpTrayIcon,
  Squares2X2Icon,
  SquaresPlusIcon,
  ChevronDownIcon,
  DocumentCheckIcon,
  MinusIcon,
  WifiIcon,
  LightBulbIcon,
  TvIcon,
MusicalNoteIcon,
} from "@heroicons/vue/24/outline";

const store = adminStore();

const name = ref("");
const location = ref("");
const thingType = ref("");
const city = ref("");
const shadowPrivateKey = ref(null);
const shadowPrivateKeyID = ref("");
const shadowCertificate = ref(null);
const shadowCertificateID = ref("");
const shadowCA = ref(null);
const shadowCAid = ref("");
const shadowEndpoint = ref("");

const error = ref("");
const success = ref("");
const hasChanged = ref(false);

//Cities List
const citiesList = ref();
const deviceList = ref();

onBeforeMount(async () => {
  citiesList.value = await store.citiesList();
  deviceList.value = await store.thingsList();
});

function uploadFile(field: string) {
  if (field === "PK") {
    (shadowPrivateKey as any).value.click();
  } else if (field === "CERT") {
    (shadowCertificate as any).value.click();
  } else if (field === "CA") {
    (shadowCA as any).value.click();
  }
}

async function fileUploader(field: any) {
  error.value = "";
  let file;
  // Type check
  if (field === "PK") {
    file = (shadowPrivateKey as any).value?.files[0];
    if (!file.name.includes(".key")) {
      shadowPrivateKey.value = null;
      error.value = "File type not accepted, you can only upload '.key' files.";
      return;
    }
  } else if (field === "CERT") {
    file = (shadowCertificate as any).value?.files[0];
    if (!file.name.includes(".crt")) {
      shadowCertificate.value = null;
      error.value = "File type not accepted, you can only upload '.crt' files.";
      return;
    }
  } else if (field === "CA") {
    file = (shadowCA as any).value?.files[0];
    if (!file.name.includes(".pem")) {
      shadowCA.value = null;
      error.value = "File type not accepted, you can only upload '.pem' files.";
      return;
    }
  }

  //Save the file on the db and wait for relative id
  const id = await store.uploadFile(file).catch((e: any) => {
    if (e?.response?.status === 413) {
      error.value = "File too large (max 10mb)";
      return;
    }
    error.value = e;
  });

  if (error.value) {
    return;
  }

  if (field === "PK") {
    (shadowPrivateKeyID as any).value = id;
  } else if (field === "CERT") {
    (shadowCertificateID as any).value = id;
  } else if (field === "CA") {
    (shadowCAid as any).value = id;
  }
}

//Function that manage the submit event
async function submit() {
  console.log(error.value, "submit");
  error.value = "";
  success.value = "";

  //check possible input errors
  if (
    !name.value ||
    !location.value ||
    !thingType.value ||
    !city.value ||
    !shadowPrivateKeyID.value ||
    !shadowCertificateID.value ||
    !shadowCAid.value ||
    !shadowEndpoint.value
  ) {
    error.value = "Please complete all fields";
    return;
  }

  //New Device istance
  const newDevice = {
    name: name.value,
    location: location.value,
    thingType: thingType.value,
    shadowPrivateKey: shadowPrivateKeyID.value,
    shadowCertificate: shadowCertificateID.value,
    shadowCA: shadowCAid.value,
    shadowEndpoint: shadowEndpoint.value.replace(/^https?:\/\//i, ""),
    city: city.value,
  };

  //Device Creation by admin
  const response = await store.createThing(newDevice).catch((e) => {
    error.value =
      e?.response?.data?.message ??
      "Internal server error, please try again...";
  });

  if (error.value) return;

  //Clean the form
  resetValues();

  //Add the new device into the list
  deviceList.value.unshift(response);

  //Show success message
  success.value = "Iot Thing correctly imported";

  hasChanged.value = false;
}

function resetValues() {
  name.value = "";
  location.value = "";
  thingType.value = "";
  city.value = "";
  shadowPrivateKey.value = null;
  shadowCertificate.value = null;
  shadowCA.value = null;
  shadowPrivateKeyID.value = "";
  shadowCertificateID.value = "";
  shadowCAid.value = "";
  shadowEndpoint.value = "";

  error.value = "";
  success.value = "";
  hasChanged.value = false;
}

function onChangeInput() {
  hasChanged.value = true;
  //error.value = "";
  success.value = "";
}

async function deleteDevice(cityID: string) {
  await store.deleteThing(cityID).catch((e) => {
    error.value = e?.response?.data?.message ?? "Elimination Failed";
  });

  if (error.value) return;

  deviceList.value = await store.thingsList();
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
                      >Shadow Name</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <select
                      v-model="thingType"
                      class="cursor-pointer block py-2.5 px-0 w-full text-sm placeholder-gray-500 text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder="Please select one"
                      required
                    >
                      <option value="sensor">Sensor</option>
                      <option value="led">Led</option>
                      <option value="display">Display</option>
                      <option value="buzzer">Buzzer</option>
                    </select>
                    <ChevronDownIcon
                      class="h-5 w-5 ml-auto -mt-7 text-gray-500 dark:text-gray-400 duration-300 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    />
                    <label
                      for="state"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >IoT thing Type</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 col-span-2">
                    <select
                      v-model="city"
                      class="cursor-pointer block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      required
                      placeholder=" "
                    >
                      <option
                        v-for="(city, index) in citiesList"
                        :key="index"
                        :value="city.id"
                      >
                        {{ city.name }}, {{ city.state }}
                      </option>
                    </select>
                    <ChevronDownIcon
                      class="h-5 w-5 ml-auto -mt-7 text-gray-500 dark:text-gray-400 duration-300 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    />
                    <label
                      for="city"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >City</label
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
                </div>
                <div class="grid md:grid-cols-2 md:gap-6 mt-3">
                  <div class="relative z-0 w-full mb-6 col-span-2">
                    <input
                      v-model="shadowEndpoint"
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
                      >Rest API Endpoint
                    </label>
                  </div>
                </div>
                <div class="w-full inline-flex mt-1">
                  <div class="w-fit mt-2">Private Key File :</div>
                  <div class="flex justify-center ml-5">
                    <div v-if="shadowPrivateKeyID" class="flex">
                      <div
                        class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2"
                      >
                        <DocumentCheckIcon
                          class="m-auto h-5 w-5 text-green-800"
                        />
                      </div>
                      <div
                        class="bg-red-100 h-fit w-fit shadow-xl rounded-full -ml-2 cursor-pointer"
                        title="Remove File"
                        @click="
                          () => {
                            shadowPrivateKeyID = '';
                            shadowPrivateKey = null;
                          }
                        "
                      >
                        <MinusIcon class="h-5 w-5 text-red-800" />
                      </div>
                    </div>
                    <div
                      v-else
                      class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2 cursor-pointer"
                      @click="uploadFile('PK')"
                    >
                      <ArrowUpTrayIcon class="m-auto h-5 w-5 text-gray-900" />
                      <input
                        ref="shadowPrivateKey"
                        type="file"
                        id="PK"
                        hidden
                        @change="fileUploader('PK')"
                        accept=".key"
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full inline-flex mt-3">
                  <div class="w-fit mt-2">Certificate File :</div>
                  <div class="flex justify-center ml-5">
                    <div v-if="shadowCertificateID" class="flex">
                      <div
                        class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2"
                      >
                        <DocumentCheckIcon
                          class="m-auto h-5 w-5 text-green-800"
                        />
                      </div>
                      <div
                        class="bg-red-100 h-fit w-fit shadow-xl rounded-full -ml-2 cursor-pointer"
                        title="Remove File"
                        @click="
                          () => {
                            (shadowCertificateID = ''),
                              (shadowCertificate = null);
                          }
                        "
                      >
                        <MinusIcon class="h-5 w-5 text-red-800" />
                      </div>
                    </div>
                    <div
                      v-else
                      class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2 cursor-pointer ml-1"
                      @click="uploadFile('CERT')"
                    >
                      <ArrowUpTrayIcon class="m-auto h-5 w-5 text-gray-900" />
                      <input
                        ref="shadowCertificate"
                        type="file"
                        id="CERT"
                        hidden
                        @change="fileUploader('CERT')"
                        accept=".crt"
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full inline-flex mt-3">
                  <div class="w-fit mt-2">CA File :</div>
                  <div class="flex justify-center ml-5">
                    <div v-if="shadowCAid" class="flex">
                      <div
                        class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2"
                      >
                        <DocumentCheckIcon
                          class="m-auto h-5 w-5 text-green-800"
                        />
                      </div>
                      <div
                        class="bg-red-100 h-fit w-fit shadow-xl rounded-full -ml-2 cursor-pointer"
                        title="Remove File"
                        @click="
                          () => {
                            (shadowCAid = ''), (shadowCA = null);
                          }
                        "
                      >
                        <MinusIcon class="h-5 w-5 text-red-800" />
                      </div>
                    </div>
                    <div
                      v-else
                      class="bg-gray-300 h-fit w-fit shadow-xl rounded-full p-2 cursor-pointer ml-1"
                      @click="uploadFile('CA')"
                    >
                      <ArrowUpTrayIcon class="m-auto h-5 w-5 text-gray-900" />
                      <input
                        ref="shadowCA"
                        type="file"
                        id="CA"
                        hidden
                        @change="fileUploader('CA')"
                        accept=".pem"
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
                IoT Device List
              </h2>
            </div>
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase border-b border-gray-200 bg-gray-50 text-center"
                  >
                    Shadow Name
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    Location
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    device type
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                  >
                    endpoint
                  </th>

                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr v-for="(device, index) in deviceList" :key="index">
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center"
                  >
                    <div
                      v-if="device.thingType === 'led'"
                      class="flex-shrink-0 w-10 h-10"
                      title="Led device"
                    >
                      <LightBulbIcon
                        class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-gray-600 bg-gray-300 p-2"
                      />
                    </div>
                    <div
                      v-if="device.thingType === 'display'"
                      class="flex-shrink-0 w-10 h-10"
                      title="Display device"
                    >
                      <TvIcon
                        class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-gray-600 bg-gray-300 p-2"
                      />
                    </div>
                    <div
                      v-if="device.thingType === 'buzzer'"
                      class="flex-shrink-0 w-10 h-10"
                      title="Buzzer device"
                    >
                      <MusicalNoteIcon
                        class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-gray-600 bg-gray-300 p-2"
                      />
                    </div>
                    <div
                      v-if="
                        device.status === 'booting' &&
                        device.thingType === 'sensor'
                      "
                      class="flex-shrink-0 w-10 h-10"
                      title="Device Under Activation"
                    >
                      <WifiIcon
                        class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-gray-600 bg-gray-300 p-1"
                      />
                    </div>
                    <div
                      v-if="
                        device.status === 'active' &&
                        device.thingType === 'sensor'
                      "
                      class="flex-shrink-0 w-10 h-10"
                      title="Active Device"
                    >
                      <WifiIcon
                        class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-green-600 bg-gray-300 p-1"
                      />
                    </div>
                    <div
                      v-if="
                        device.status === 'inactive' &&
                        device.thingType === 'sensor'
                      "
                      class="flex-shrink-0 w-10 h-10"
                      title="Inactive Device"
                    >
                      <WifiIcon
                        class="shadow-xl rounded-full w-10 h-10 align-middle border-none text-red-600 bg-gray-300 p-1"
                      />
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center"
                  >
                    <div class="text-sm font-medium leading-5 text-gray-900">
                      {{ device?.name }}
                    </div>
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center"
                  >
                    <div class="text-sm font-medium leading-5 text-gray-900">
                      {{ device?.city?.name }}, {{ device?.city?.state }}
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ device?.location }}
                    </div>
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center"
                  >
                    <span
                      class="inline-flex px-2 text-sm font-medium leading-5 capitalize"
                      >{{ device?.thingType }}
                    </span>
                  </td>

                  <td class="px-6 py-4 border-b border-gray-200 text-center">
                    <span class="inline-flex px-2 text-xs leading-5">{{
                      device?.shadowEndpoint
                    }}</span>
                  </td>

                  <td
                    class="pr-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                  >
                    <button
                      @click="deleteDevice(device?.id)"
                      class="text-red-700 hover:text-red-900"
                    >
                      Delete
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
