<script setup lang="ts">
defineProps<{
  modalHandler: Function;
}>();
</script>

<template>
  <div
    class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center"
  >
    <div
      class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
      @click="modalHandler(false)"
    />

    <div
      class="z-50 w-11/12 mx-auto overflow-y-auto bg-gray-100 rounded shadow-lg modal-container md:max-w-md"
    >
      <div class="px-6 py-4 text-left modal-content">
        <!-- Body -->
        <p class="mb-3 text-gray-800">
          In case you also want to receive notifications on telegram, use
          our bot
          <a href="https://t.me/Earthquake_Control_Bot" class="text-blue-500"
            >@Earthquake_Control_Bot</a
          >. <br>
          If you do not receive notifications for a while,
          remember to keep updated the chatID field on your profile by typing
          "/chatID" on the chat with the bot and entering the returned code.
        </p>

        <!-- Footer -->
        <div class="flex justify-end pt-2">
          <button
            class="p-3 px-6 py-3 mr-2 text-indigo-500 rounded-lg bg-gray-300 hover:text-indigo-400 focus:outline-none"
            @click="modalHandler(false)"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
