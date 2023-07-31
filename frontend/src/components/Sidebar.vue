<script setup lang="ts">
import { ref, computed } from "vue";
import { useSidebar } from "../composables/useSidebar";
import { useRouter } from "vue-router";
import { userStore } from "../store/user";
import {
  UserCircleIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  Squares2X2Icon,
  BuildingLibraryIcon,
  BellIcon,
  CpuChipIcon,
} from "@heroicons/vue/24/outline";
import { noticationsStore } from "../store/notifications";

const { currentRoute } = useRouter();
const { isOpen } = useSidebar();

const router = useRouter();
const store = userStore();
const storeNotification = noticationsStore();

const notifications = computed(() => storeNotification.newNotifications);

const user = computed(() => store.user);

const activeClass = ref(
  "bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100"
);
const inactiveClass = ref(
  "border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
);

async function logout() {
  await store.logout();
  router.push("/login");
}
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed min-h-screen flex flex-col inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <img class="w-full" src="/logo-big-white-no-motto.png" alt="" />

      <nav class="mt-8">
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Home' ? activeClass : inactiveClass]"
          to="/Home"
        >
          <Squares2X2Icon class="w-5 h-5" />

          <span class="mx-4">Home</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Cities' ? activeClass : inactiveClass]"
          to="/Cities"
        >
          <BuildingLibraryIcon class="w-5 h-5" />

          <span class="mx-4">Cities</span>
        </router-link>

        <router-link
          class="flex items-center pl-6 py-2 mt-4 duration-200 border-l-4"
          :class="[
            $route.name === 'NotificationCenter' ? activeClass : inactiveClass,
          ]"
          to="/NotificationCenter"
          @click="storeNotification.resetNewNotifications"
        >
          <BellIcon class="w-5 h-5" />

          <span class="mx-4">Notification Center</span>
          <div
            v-if="notifications != 0"
            class="bg-red-600 bg-opacity-70 rounded-full text-md h-6 w-6 flex text-sm font-bold text-white"
          >
            <span class="m-auto">{{ notifications }}</span>
          </div>
        </router-link>

        <!-- START ADMIN PANEL -->
        <div
          class="flex mt-8 w-full bg-gradient-to-r from-gray-900 via-slate-400 to-gray-900"
          v-if="user?.isAdmin"
        >
          <span class="m-auto font-bold rounded-full p-2">Admin Panel</span>
        </div>

        <router-link
          v-if="user?.isAdmin"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'AdminUsers' ? activeClass : inactiveClass]"
          to="/Admin/Users"
        >
          <UserGroupIcon class="w-5 h-5" />

          <span class="mx-4">User Management</span>
        </router-link>

        <router-link
          v-if="user?.isAdmin"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'AdminCities' ? activeClass : inactiveClass]"
          to="/Admin/Cities"
        >
          <BuildingOffice2Icon class="w-5 h-5" />

          <span class="mx-4">City Management</span>
        </router-link>

        <router-link
          v-if="user?.isAdmin"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'IoTdevice' ? activeClass : inactiveClass]"
          to="/Admin/IoTdevice"
        >
          <CpuChipIcon class="w-6 h-6" />

          <span class="mx-4">Iot Device Management</span>
        </router-link>
      </nav>
      <div class="my-4"></div>

      <!-- START profile zone -->
      <div class="mt-auto w-full">
        <div
          v-if="currentRoute.name != 'Me'"
          class="flex flex-col w-full pb-8 pt-4 px-2 bg-slate-800"
        >
          <img
            v-if="user?.avatar"
            class="object-cover w-14 h-14 rounded-full m-auto bg-gray-300"
            v-bind:src="user?.avatar?.data"
          />
          <UserCircleIcon
            v-else
            class="shadow-xl rounded-full align-middle border-none w-14 h-14 text-gray-900 bg-gray-300 m-auto"
          />
          <div
            class="flex flex-col justify-center items-center gap-y-1 py-2 w-full"
          >
            <div class="m-auto">
              <h1
                class="text-xl font-semibold text-gray-700 capitalize dark:text-white"
              >
                {{ user?.firstName }} {{ user?.lastName }}
              </h1>
            </div>
          </div>
          <div
            class="flex row gap-x-5 item-center m-auto mt-2 text-white text-md"
          >
            <button
              class="px-4 py-1 bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              @click="router.push('/Me')"
            >
              Edit Profile
            </button>
            <button
              class="px-4 py-1 bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col w-full pb-4 pt-5 px-2 bg-slate-800">
          <button
            class="px-4 py-1 mx-auto text-white bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50"
            @click="logout"
          >
            Logout
          </button>
        </div>
        <!-- END profile zone -->
      </div>
    </div>
  </div>
</template>
