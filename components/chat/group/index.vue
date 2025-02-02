<script setup lang="ts">
import { ref } from "vue";
import type { GenerateResponse } from "~/stores/generate";

const { $api } = useNuxtApp();

const tagStore = useTagStore();
const { model } = storeToRefs(tagStore);

const prompt = ref("why sky so blue?");
const output = ref("");

async function generateStream() {
  output.value = "";

  const response = await $api<ReadableStream>("/api/generate", {
    method: "POST",
    body: {
      model: model.value?.model,
      prompt: prompt.value,
    },
    responseType: "stream",
  });

  const reader = response.pipeThrough(new TextDecoderStream()).getReader();

  // Read the chunk of data as we get it
  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    try {
      const valueObject: GenerateResponse = JSON.parse(value);
      output.value = output.value + valueObject.response;
    } catch (e) {
      console.error(e); // incase json parse throw error, logs it and goes on
    }
  }
}

onMounted(() => {
  generateStream();
});
</script>

<template>
  <div class="bg-red-200 relative w-full h-full">
    <!-- Display the streamed output -->
    <div v-if="output">{{ output }}</div>
    <div class="absolute bottom-0 left-0 w-full h-32 bg-white">
      <!-- Bind the textarea to the prompt -->
      <textarea class="w-full h-32" v-model="prompt"></textarea>
    </div>
  </div>
</template>
