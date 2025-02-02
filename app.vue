<script setup lang="ts">
const tagStore = useTagStore();
const { models } = storeToRefs(tagStore);
</script>

<template>
  <div>
    <aside class="absolute left-0 top-0 w-64 bg-gray-100 h-[100dvh]">
      <ul>
        <li>
          <!-- TODO: list of chat rooms -->
        </li>
      </ul>
    </aside>
    <div class="pl-64 w-full h-[100dvh]">
      <div class="bg-red-200 relative w-full h-full">
        <!-- TODO: Chat room _id -->
        <div class="absolute bottom-0 left-0 w-full h-32 bg-white">
          <textarea class="w-full h-32"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
