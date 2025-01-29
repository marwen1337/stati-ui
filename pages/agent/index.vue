<script setup lang="ts">
import type { AgentWithConnectionStatus } from '~/lib/model/agent.interface'
import AddAgentButton from '~/components/agent/AddAgentButton.vue'
import AgentCard from '~/components/agent/AgentCard.vue'

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

</script>

<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AgentCard v-for="agent in data" :key="agent.id" :agent="agent" @deleted="removeAgentFromList" />
    </div>
    <ClientOnly>
      <Teleport to="#navbarTeleportSlot">
        <AddAgentButton @created="addAgentToList" />
      </Teleport>
    </ClientOnly>
  </div>
</template>
