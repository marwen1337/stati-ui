<script setup lang="ts">
import { PencilIcon, TrashIcon } from 'lucide-vue-next'
import type { AgentWithConnectionStatus } from '~/lib/model/agent.interface'
import StatusBadge from '~/components/utils/StatusBadge.vue'
import { toast } from '~/components/ui/toast'

const route = useRoute()

definePageMeta({
  title: 'Agent Details'
})

const agent = await useApiFetchData<AgentWithConnectionStatus>(`/agent/${route.params.id}`)
  .then((agent) => {
    if (!agent.value) {
      throw createError({ statusCode: 404, statusMessage: 'Agent Not Found' })
    }
    return agent as Ref<AgentWithConnectionStatus>
  })

const deleteAgent = () => {
  useApiFetch(`/agent/${agent.value.id}`, { method: 'DELETE' }).then((res) => {
    if (res.error.value) {
      toast({ title: `Error ${res.status.value}`, description: res.error.value, variant: 'destructive' })
      return
    }
    toast({ title: 'Agent deleted', description: `Deleted agent ${agent.value.name}` })
    navigateTo('/agent')
  }).catch((e) => {
    toast({ title: 'Error', description: e, variant: 'destructive' })
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card>
      <CardHeader ref="titleCardHeader" class="flex flex-row justify-between">
        <div class="flex items-center gap-2">
          <CardTitle>
            {{ agent.name }}
          </CardTitle>
          <StatusBadge :up="agent.isConnected">
            {{ agent.isConnected ? 'Connected' : 'Not connected' }}
          </StatusBadge>
        </div>
        <div class="flex gap-4 items-center">
          <Button variant="secondary" disabled>
            <PencilIcon />
            Edit
          </Button>
          <Button variant="destructive" @click="deleteAgent">
            <TrashIcon />
            Delete
          </Button>
        </div>
      </CardHeader>
    </Card>
  </div>
</template>

<style scoped>

</style>
