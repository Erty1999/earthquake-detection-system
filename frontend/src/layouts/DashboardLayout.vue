<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
// import Header from '../components/Header.vue'
import { useSidebar } from "../composables/useSidebar";

const { isOpen } = useSidebar();
</script>

<template>
  <div class="flex h-screen bg-gray-200 font-roboto">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container mx-auto px-6 py-8">
          <!-- open sidebar icon -->
          <div class="flex items-center justify-between mb-4 ">
            <button
              class="text-gray-500 focus:outline-none lg:hidden"
              @click="isOpen = true"
            >
              <svg
                class="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H11"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
