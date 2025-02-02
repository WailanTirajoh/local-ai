<script setup lang="ts">
const tagStore = useTagStore();
const { models, model } = storeToRefs(tagStore);
</script>

<template>
  <div class="relative h-16 w-full bg-white flex items-center p-2 z-10">
    <HeadlessMenu v-if="model" as="div" class="relative inline-block text-left">
      <div>
        <HeadlessMenuButton
          class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black/80 hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 duration-300 cursor-pointer"
        >
          {{ model.name }}
        </HeadlessMenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <HeadlessMenuItems
          class="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          <div class="px-1 py-1">
            <HeadlessMenuItem
              v-for="_model in models"
              :key="_model.model"
              v-slot="{ active }"
            >
              <button
                :class="[
                  active ? 'bg-black/10' : '',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer duration-300 text-gray-900',
                ]"
                @click="model = _model"
              >
                {{ _model.name }}
              </button>
            </HeadlessMenuItem>
          </div>
        </HeadlessMenuItems>
      </transition>
    </HeadlessMenu>
  </div>
</template>
