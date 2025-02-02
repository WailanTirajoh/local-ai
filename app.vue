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
      <ChatGroup />
    </div>
  </div>
</template>
