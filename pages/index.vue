<script setup lang="ts">
import { ChevronRightIcon } from 'lucide-vue-next'

definePageMeta({
  title: 'Dashboard'
})

const gridItems: { title: string, value: string | number, to: string }[] = [
  {
    title: 'Monitors',
    value: '',
    to: '/monitor'
  },
  {
    title: 'Agents',
    value: '',
    to: '/agent'
  }
]

</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <NuxtLink v-for="item in gridItems" :key="item.to" :to="item.to" class="group">
      <Card>
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
        </CardHeader>
        <CardFooter class="flex justify-end  opacity-0 group-hover:opacity-100 transition-all">
          <Button variant="ghost">
            <ChevronRightIcon />
            Go
          </Button>
        </CardFooter>
      </Card>
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>
