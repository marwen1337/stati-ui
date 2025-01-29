<script setup lang="ts">
import type { MonitorWithStatus } from '~/lib/model/monitor.interface'
import AddMonitorButton from '~/components/monitor/AddMonitorButton.vue'

const data = ref((await useApiFetchData<MonitorWithStatus[]>('/monitor')).value ?? [])

definePageMeta({
  title: 'Monitors'
})

const addMonitorToList = (monitor: MonitorWithStatus) => {
  data.value.unshift(monitor)
}

const removeMonitorFromList = (monitorId: string) => {
  data.value.splice(data.value.findIndex(m => m.id === monitorId), 1)
}

</script>

<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <MonitorCard v-for="monitor in data" :key="monitor.id" :monitor="monitor" @deleted="removeMonitorFromList" />
    </div>
    <ClientOnly>
      <Teleport to="#navbarTeleportSlot">
        <AddMonitorButton @created="addMonitorToList" />
      </Teleport>
    </ClientOnly>
  </div>
</template>
