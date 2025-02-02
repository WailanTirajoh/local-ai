import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:11434",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@vueuse/nuxt", "@pinia/nuxt"],

  pinia: {
    storesDirs: ["./stores/**"],
  },
});
