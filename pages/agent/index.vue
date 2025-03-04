<script setup lang="ts">
import { TrashIcon } from 'lucide-vue-next'
import type { AgentWithConnectionStatus } from '~/lib/model/agent.interface'
import AddAgentButton from '~/components/agent/AddAgentButton.vue'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import StatusBadge from '~/components/utils/StatusBadge.vue'

const data = ref((await useApiFetchData<AgentWithConnectionStatus[]>('/agent')).value ?? [])

definePageMeta({
  title: 'Agents'
})

const addAgentToList = (agent: AgentWithConnectionStatus) => {
  data.value.unshift(agent)
}

const removeAgentFromList = (agentId: string) => {
  data.value.splice(data.value.findIndex(m => m.id === agentId), 1)
}

const deleteAgent = async (id: string) => {
  await useApiFetchData(`/agent/${id}`, { method: 'DELETE' })
  removeAgentFromList(id)
}

</script>

<template>
  <div class="rounded-lg border">
    <Table class="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>
            Name
          </TableHead>
          <TableHead>
            Connected
          </TableHead>
          <TableHead>
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="agent in data" :key="agent.id">
          <TableCell class="font-medium">
            <NuxtLink :to="`/agent/${agent.id}`">
              {{ agent.name }}
            </NuxtLink>
          </TableCell>
          <TableCell :class="agent.isConnected ? 'text-green-500' : 'text-red-500'">
            <StatusBadge :up="agent.isConnected">
              {{ agent.isConnected ? 'Yes' : 'No' }}
            </StatusBadge>
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              class="text-red-500 hover:text-red-500 hover:bg-red-500/10"
              @click="deleteAgent(agent.id)"
            >
              <TrashIcon />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <ClientOnly>
      <Teleport to="#navbarTeleportSlot">
        <AddAgentButton @created="addAgentToList" />
      </Teleport>
    </ClientOnly>
  </div>
</template>
