<script setup lang="ts">
import type { MonitorWithStatus } from '~/lib/model/monitor.interface'
import AddMonitorButton from '~/components/monitor/AddMonitorButton.vue'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { Badge } from '~/components/ui/badge'
import StatusBadge from '~/components/utils/StatusBadge.vue'
import { cronToHumanReadable } from '~/lib/utils'

const data = ref((await useApiFetchData<MonitorWithStatus[]>('/monitor')).value ?? [])

definePageMeta({
  title: 'Monitors'
})

const addMonitorToList = (monitor: MonitorWithStatus) => {
  data.value.unshift(monitor)
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
            <Badge>{{ monitor.type }}</Badge>
          </TableCell>
          <TableCell>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{{ cronToHumanReadable(monitor.cronSchedule) }}</TooltipTrigger>
                <TooltipContent>
                  <p>{{ monitor.cronSchedule }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell :class="monitor.status === MonitorStatus.UP ? 'text-green-500' : 'text-red-500'">
            <StatusBadge :up="monitor.status === MonitorStatus.UP">
              {{ monitor.status }}
            </StatusBadge>
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
