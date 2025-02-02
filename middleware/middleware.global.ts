import type { Tag } from "~/types/tags";

export default defineNuxtRouteMiddleware(async () => {
  const { $api } = useNuxtApp();

  const tagStore = useTagStore();
  const { models, model } = storeToRefs(tagStore);

  if (!models.value || models.value?.length === 0) {
    const data = await $api<Tag>("/api/tags");
    tagStore.setModels(data.models);

    if (data.models.length > 0) {
      model.value = data.models[0];
    }
  }
});
