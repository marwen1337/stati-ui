import type { UseFetchOptions } from '#app'
import { defu } from 'defu'

export function useApiFetch<T> (url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.api.baseUrl,
    key: url
  }

  const params = defu(options, defaults)
  return useFetch(url, params)
}
