<script setup lang="ts">
import { ref } from "vue";
import { marked } from "marked";
import type { Chat, ChatStream } from "~/types/chat";

const { $api } = useNuxtApp();
const tagStore = useTagStore();
const { model } = storeToRefs(tagStore);

const USER_ROLE = "user";
const SYSTEM_ROLE = "system";

const prompt = ref("");
const chats = ref<Chat[]>([]);

const pushChat = (chat: Omit<Chat, "id">) => {
  chats.value.push({
    id: generateULID(),
    ...chat,
  });
};

const updateLastChat = async (content: string, isDone: boolean = false) => {
  const lastChat = chats.value.at(-1);
  if (!lastChat) return;

  lastChat.content = content;
  lastChat.isDone = isDone;
  lastChat.parsedContent = await marked.parse(content);
};

const handleStreamError = () => {
  const lastChat = chats.value.at(-1);
  if (lastChat) {
    lastChat.content = "Error: Failed to generate response";
    lastChat.parsedContent = "Error: Failed to generate response";
    lastChat.isDone = true;
  }
};

const processStream = async (reader: ReadableStreamDefaultReader<string>) => {
  let result = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        await updateLastChat(result, true);
        break;
      }

      try {
        const valueObject: ChatStream = JSON.parse(value);
        result += valueObject.message.content;
        await updateLastChat(result);
      } catch (e) {
        console.error("Error parsing stream chunk:", e);
      }
    }
  } catch (error) {
    console.error("Stream processing error:", error);
    handleStreamError();
  }
};

const fetchChatStream = async () => {
  return await $api<ReadableStream>("/api/chat", {
    method: "POST",
    body: {
      model: model.value?.model,
      messages: chats.value,
    },
    responseType: "stream",
  });
};

const generateStream = async () => {
  if (!prompt.value.trim()) return;

  try {
    // Add user message
    pushChat({
      role: USER_ROLE,
      content: prompt.value,
      parsedContent: prompt.value,
      isDone: true,
    });
    prompt.value = "";

    // Add system placeholder
    pushChat({
      role: SYSTEM_ROLE,
      content: "",
      isDone: false,
    });

    // Fetch and process stream
    const response = await fetchChatStream();
    const reader = response.pipeThrough(new TextDecoderStream()).getReader();
    await processStream(reader);
  } catch (error) {
    console.error("API request failed:", error);
    handleStreamError();
  }
};
</script>

<template>
  <div class="relative">
    <div class="h-[calc(100dvh-9rem-5rem)] overflow-auto">
      <ul>
        <li v-for="chat in chats" :key="chat.id">
          <div
            class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-4 mx-auto"
          >
            <div class="capitalize">
              {{ chat.role }}
            </div>
            <div v-html="chat.parsedContent"></div>
          </div>
          <hr class="border border-gray-50" />
        </li>
      </ul>
    </div>

    <div class="absolute bottom-0 left-0 w-full h-36 p-2">
      <textarea
        class="w-full h-24 text-sm xl:text-base rounded xl:rounded-lg px-2 !py-2 outline-none bg-white transition duration-300 ease-in-out focus:ring-1 focus:ring-[#0068EF] disabled:!bg-gray-100 disabled:!cursor-not-allowed shadow-lg"
        v-model="prompt"
        @keydown.enter.exact.prevent="generateStream"
        placeholder="Type your message..."
      ></textarea>
    </div>
  </div>
</template>
