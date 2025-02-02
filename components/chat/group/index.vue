<script setup lang="ts">
import { ref } from "vue";
import { marked } from "marked";
import type { GenerateResponse } from "~/stores/generate";

const { $api } = useNuxtApp();

const tagStore = useTagStore();
const { model } = storeToRefs(tagStore);

const prompt = ref("How to create vue app?");
const generatedModel = ref("");
const output = ref("");
const markedResponse = ref("");

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
      markedResponse.value = await marked.parse(output.value);
      generatedModel.value = valueObject.model;
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
  <div class="relative w-full h-full">
    <div class="h-[calc(100dvh-9rem)] overflow-auto">
      <div
        class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-4 mx-auto"
      >
        <div class="" v-html="markedResponse"></div>
        <div class="prose">Generated using: {{ generatedModel }}</div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full h-36 p-2">
      <div class="">
        <textarea
          class="w-full h-24 text-sm xl:text-base rounded xl:rounded-lg px-2 !py-2 outline-none bg-white transition duration-300 ease-in-out focus:ring-1 focus:ring-[#0068EF] disabled:!bg-gray-100 disabled:!cursor-not-allowed shadow-lg"
          v-model="prompt"
          @keydown.enter="generateStream"
        ></textarea>
      </div>
    </div>
  </div>
</template>
