<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { marked } from "marked";

const props = defineProps<{
  content: string;
}>();

const parsedContent = computedAsync(
  () =>
    marked.parse(
      props.content
        .replace(/<think>/g, '<div class="think">')
        .replace(/<\/think>/g, "</div>")
    ),
  ""
);
</script>

<template>
  <div
    v-html="parsedContent"
    class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none"
  ></div>
</template>
