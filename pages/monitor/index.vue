<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import type { MonitorWithStatus } from '~/lib/model/monitor-with-status.interface'

const { data } = await useApiFetch<MonitorWithStatus[]>('/monitor')

definePageMeta({
  title: 'Monitors'
})

</script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-4">
      <MonitorCard v-for="monitor in data" :key="monitor.id" :monitor="monitor" />
    </div>
    <Teleport to="#navbarTeleportSlot">
      <Button variant="ghost">
        <PlusIcon />
        Add Monitor
      </Button>
    </Teleport>
  </div>
</template>
