<script setup lang="ts">
import { ref } from "vue";
import type { Chat, ChatStream } from "~/types/chat";

const { $api } = useNuxtApp();
const tagStore = useTagStore();
const { model } = storeToRefs(tagStore);

const prompt = ref("");
const chats = ref<Chat[]>([
  {
    id: generateULID(),
    role: ROLE.system,
    content: "you are a salty pirate",
    done: true,
  },
]);

const pushChat = (chat: Omit<Chat, "id">) => {
  chats.value.push({
    id: generateULID(),
    ...chat,
  });
};

const updateLastChat = async (content: string, done: boolean = false) => {
  const lastChat = chats.value.at(-1);
  if (!lastChat) return;

  lastChat.content = content;
  lastChat.done = done;
};

const handleStreamError = () => {
  const lastChat = chats.value.at(-1);
  if (!lastChat) return;

  lastChat.content = "Error: Failed to generate response";
  lastChat.done = true;
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
        await updateLastChat(result, valueObject.done);
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
      messages: chats.value
        .map((chat) => {
          const { role, content } = chat;
          return { role, content };
        })
        .filter((chat) => chat.content !== ""),
    },
    responseType: "stream",
  });
};

const generateStream = async () => {
  if (!prompt.value.trim()) return;

  try {
    // Add user message
    pushChat({
      role: ROLE.user,
      content: prompt.value,
      done: true,
    });
    prompt.value = "";

    // Add system placeholder
    pushChat({
      role: ROLE.assistant,
      content: "",
      done: false,
      model: model.value?.model,
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
    <div class="h-[calc(100dvh-9rem-5rem)] overflow-auto py-8">
      <ul class="grid gap-6">
        <li
          v-for="chat in chats.filter((chat) => chat.role !== ROLE.system)"
          :key="chat.id"
          class="group"
        >
          <div class="max-w-6xl mx-auto flex group-odd:flex-row-reverse gap-4">
            <div class="capitalize group-odd:text-right text-2xl py-2">
              <template v-if="chat.role === ROLE.assistant">
                <div class="text-center">
                  <Icon name="mdi:pirate" size="40" class="text-gray-800" />
                </div>
              </template>
              <template v-if="chat.role === ROLE.user">
                <div class="text-center">
                  <Icon name="uis:user-md" size="40" class="text-gray-800" />
                </div>
              </template>
              <div class="text-center text-base italic text-gray-600">
                {{ chat.role }}
              </div>
            </div>
            <div class="pt-7">
              <div
                class="bg-white border border-gray-200 p-4 rounded-2xl group-even:rounded-tl-none group-odd:rounded-tr-none max-w-4xl group-odd:ml-auto"
              >
                <template v-if="chat.content">
                  <ChatGroupContent :content="chat.content" />
                  <div v-if="chat.model" class="text-xs italic text-gray-600">
                    Generated using {{ chat.model }}
                  </div>
                </template>
                <template v-else>
                  <div class="flex animate-pulse space-x-4 w-xl">
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-5 rounded bg-gray-200"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                          <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                        </div>
                        <div class="h-2 rounded bg-gray-200"></div>
                        <div class="grid grid-cols-3 gap-4">
                          <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                          <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        </div>
                        <div class="h-2 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
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

<style>
.think {
  padding-left: 1rem;
  font-size: 1rem;
  border-left: 2px solid #8b8b8b;
}
</style>
