import type { Tag } from "~/types/tags";

export default defineNuxtRouteMiddleware(async () => {
  const { $api } = useNuxtApp();

  const tagStore = useTagStore();
  const { models } = storeToRefs(tagStore);

  if (!models.value || models.value?.length === 0) {
    const data = await $api<Tag>("/api/tags");
    tagStore.setModels(data.models);
  }
});
