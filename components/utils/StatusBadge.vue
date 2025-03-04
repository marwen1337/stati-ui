<script setup lang="ts">
import { Badge } from '~/components/ui/badge'

defineProps<{ up: boolean }>()
</script>

<template>
  <Badge v-if="up" class="bg-green-500 hover:bg-green-400">
    <slot />
  </Badge>
  <Badge v-else class="bg-red-500 hover:bg-red-400">
    <slot />
  </Badge>
</template>

<style scoped>

</style>
