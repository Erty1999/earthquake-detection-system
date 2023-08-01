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
      class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
    >
      <div class="px-6 py-4 text-left modal-content">
        <!-- Title -->
        <div class="flex items-center justify-between pb-3">
          <p class="text-2xl font-bold">Are you sure ?</p>
        </div>

        <!-- Body -->
        <p class="mb-3">This action is not reversible</p>

        <!-- Footer -->
        <div class="flex justify-end pt-2">
          <button
            class="p-3 px-6 py-3 mr-2 text-indigo-500 rounded-lg bg-gray-200 hover:text-indigo-400 focus:outline-none"
            @click="modalHandler(false)"
          >
            Cancel
          </button>
          <button
            class="px-6 py-3 font-medium tracking-wide text-white bg-red-600 rounded-md hover:bg-indigo-500 focus:outline-none"
            @click="modalHandler(true)"
          >
            Permanently Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
