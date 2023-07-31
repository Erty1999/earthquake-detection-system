<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { ref } from "vue";
import { userStore } from "../store/user";
import { noticationsStore } from "../store/notifications";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import {
  BellAlertIcon,
  Cog8ToothIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/outline";

const storeUser = userStore();
const storeNotification = noticationsStore();
const router = useRouter();

//Reset the notification number on sidebar when leave the page
onBeforeRouteLeave((_to, _from, next) => {
  storeNotification.resetNewNotifications();
  next();
});

const user = computed(() => storeUser.user);
const notifications = computed(() => storeNotification.notifications);
const subscriptions = ref();

//Subscription list
onBeforeMount(async () => {
  subscriptions.value = await storeUser.getSubscriptions();
});

//Function that manage the update of a sub
async function updateSub(subID: string, lowAlert: boolean, highAlert: boolean) {
  await storeUser.updateSub(subID, lowAlert, highAlert).catch((e) => {
    console.log(e);
  });
  //refresh subscription list
  subscriptions.value = await storeUser.getSubscriptions();
}
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
              <h2
                class="mt-2 px-2 text-2xl font-medium text-gray-700 mx-auto text-center"
              >
                Here you will be able to see and manage
                <span class="font-bold">real-time notifications</span> from the
                cities you will follow
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
  <div
    v-else
    class="flex gap-y-10 lg:h-[calc(100vh-80px)] h-[calc(100vh-100px)] justify-between flex-wrap"
  >
    <!--notification list-->
    <div
      class="w-full lg:w-5/12 bg-white rounded-lg shadow-xl h-full overflow-y-auto"
    >
      <!--header-->
      <div
        class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow rounded-t-lg bg-gray-100 mb-5"
      >
        <div class="flex text-gray-700 mt-8 ml-5 mb-8 items-center w-full">
          <BellAlertIcon class="h-12 rounded-full p-2 bg-red-600 text-white" />
          <h2 class="text-3xl font-medium text-gray-700 ml-3">Notifications</h2>
          <button
            v-if="notifications.length != 0"
            class="ml-auto mr-12 mt-3 text-blue-700"
            type="button"
            @click="storeNotification.deleteNotifications()"
          >
            Delete All
          </button>
        </div>
      </div>
      <!--list-->
      <div
        v-if="notifications.length != 0"
        v-for="notif in notifications"
        class="mb-5 bg-gray-100 p-5 rounded-lg mx-5 font-medium text-gray-700 shadow-md flex"
      >
        <ExclamationCircleIcon
          class="w-6 h-6 mr-5 text-orange-800 bg-orange-100 rounded-full my-auto"
          v-if="notif.msg.split(' ')[0] === 'Low'"
        />
        <ExclamationCircleIcon
          class="w-6 h-6 mr-5 text-red-800 bg-red-200 rounded-full my-auto"
          v-if="notif.msg.split(' ')[0] === 'High'"
        />
        {{ notif.msg }}
        <span class="ml-auto text-gray-400 text-sm mt-auto">{{
          notif.time
        }}</span>
      </div>
      <div
        v-else
        class="bg-gray-100 p-5 rounded-lg w-fit mx-auto font-medium text-gray-700 shadow-md"
      >
        No new notifications
      </div>
    </div>
    <!--notification manager-->
    <div
      class="w-full lg:w-6/12 bg-white rounded-lg shadow-xl h-full overflow-y-auto"
    >
      <!--header-->
      <div
        class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow rounded-t-lg bg-gray-100"
      >
        <div class="flex text-gray-700 mt-8 ml-5 mb-8 items-center w-full">
          <Cog8ToothIcon class="h-12 rounded-full p-2 bg-pink-600 text-white" />
          <h2 class="text-3xl font-medium text-gray-700 ml-3">
            Notification Manager
          </h2>
        </div>
      </div>
      <!--list-->
      <div
        v-for="sub in subscriptions"
        class="mb-0.5 bg-gray-50 p-5 font-medium text-gray-700 shadow-md flex"
      >
        <!--city-->
        <div
          class="flex flex-col text-center w-1/4 cursor-pointer"
          @click="router.push(sub?.city?.state + '/' + sub?.city?.name)"
        >
          <div class="text-sm font-medium leading-5 text-gray-900">
            {{ sub?.city?.name }}
          </div>
          <div class="text-sm leading-5 text-gray-500">
            {{ sub?.city?.state }}
          </div>
        </div>
        <!--low alert-->
        <div class="flex flex-col text-center w-1/4">
          <div>
            <input
              type="checkbox"
              v-model="sub.lowAlert"
              @change="updateSub(sub.id, sub.lowAlert, sub.highAlert)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="text-sm leading-5 text-gray-500">Low Alert</div>
        </div>
        <!--high alert-->
        <div class="flex flex-col text-center w-1/4">
          <div>
            <input
              type="checkbox"
              v-model="sub.highAlert"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              @change="updateSub(sub.id, sub.lowAlert, sub.highAlert)"
            />
          </div>
          <div class="text-sm leading-5 text-gray-500">High Alert</div>
        </div>
        <!--disable alert-->
        <div class="flex flex-col text-center w-1/4">
          <div>
            <input
              type="checkbox"
              :checked="sub.noAlert"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              @change="updateSub(sub.id, false, false)"
            />
          </div>
          <div class="text-sm leading-5 text-gray-500">No Alert</div>
        </div>
      </div>
    </div>
  </div>
</template>
