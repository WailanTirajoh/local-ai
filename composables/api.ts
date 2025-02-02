import type { UseFetchOptions } from "nuxt/app";

export const useAPI = <T>(
  request: string | (() => string),
  opts?: UseFetchOptions<T>
) => {
  return useFetch(request, {
    ...opts,
    $fetch: useNuxtApp().$api,
  });
};
