export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
  });

  return {
    provide: {
      api,
    },
  };
});
