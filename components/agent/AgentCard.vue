<script setup lang="ts">

import { TrashIcon } from 'lucide-vue-next'
import type { AgentWithConnectionStatus } from '~/lib/model/agent.interface'

const emit = defineEmits<{(e: 'deleted', id: string): void }>()
const { agent } = defineProps<{ agent: AgentWithConnectionStatus }>()

const deleteAgent = async () => {
  await useApiFetchData(`/agent/${agent.id}`, { method: 'DELETE' })
  emit('deleted', agent.id)
}

</script>

<template>
  <Card class="group">
    <CardContent class="flex flex-row justify-between items-center py-4 gap-4">
      <CardTitle>{{ agent.name }}</CardTitle>
      <div class="flex items-center gap-2">
        <span
          class="w-4 h-4 rounded-full"
          :class="agent.isConnected ? 'bg-green-500' : 'bg-red-500'"
        />
        <Button variant="ghost" @click="deleteAgent">
          <TrashIcon />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
