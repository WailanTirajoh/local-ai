import type { Model, Tag } from "~/types/tags";

export const useTagStore = defineStore("tag", () => {
  const models = ref<Model[]>([]);
  const model = ref<Model>();

  const setModels = (_models: Model[]) => {
    models.value = _models;
  };
  return { models, setModels, model };
});
