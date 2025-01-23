import type { Ref } from 'vue'
import type { UseFetchOptions } from '#app'
import { useApiFetch } from '~/composables/useApiFetch'

export async function useApiFetchData<T = any> (request: string, options: UseFetchOptions<T> = {}) {
  const { data } = await useApiFetch<T>(request, options)
  return data as Ref<T | null>
}
