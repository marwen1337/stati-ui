<script setup lang="ts">
import { TrashIcon } from 'lucide-vue-next'
import type { MonitorWithStatus } from '~/lib/model/monitor.interface'
import AddMonitorButton from '~/components/monitor/AddMonitorButton.vue'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'

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

const deleteMonitor = async (id: string) => {
  await useApiFetchData(`/monitor/${id}`, { method: 'DELETE' })
  removeMonitorFromList(id)
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
            Type
          </TableHead>
          <TableHead>
            Interval
          </TableHead>
          <TableHead>
            Status
          </TableHead>
          <TableHead>
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="monitor in data" :key="monitor.id">
          <TableCell class="font-medium">
            <NuxtLink :to="`/monitor/${monitor.id}`">
              {{ monitor.name }}
            </NuxtLink>
          </TableCell>
          <TableCell>
            {{ monitor.type }}
          </TableCell>
          <TableCell>
            {{ monitor.intervalSeconds }} seconds
          </TableCell>
          <TableCell :class="monitor.status === MonitorStatus.UP ? 'text-green-500' : 'text-red-500'">
            {{ monitor.status }}
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              class="text-red-500 hover:text-red-500 hover:bg-red-500/10"
              @click="deleteMonitor(monitor.id)"
            >
              <TrashIcon />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <ClientOnly>
      <Teleport to="#navbarTeleportSlot">
        <AddMonitorButton @created="addMonitorToList" />
      </Teleport>
    </ClientOnly>
  </div>
</template>
