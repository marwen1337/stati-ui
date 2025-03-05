<script setup lang="ts">
import type { MonitorMetric } from '~/lib/model/monitor-metric.interface'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'

defineProps<{ metrics: MonitorMetric[] }>()

const colorsMap: Record<MonitorStatus, string> = {
  [MonitorStatus.UP]: 'bg-green-500',
  [MonitorStatus.DOWN]: 'bg-red-500',
  [MonitorStatus.UNKNOWN]: 'bg-gray-300'
}
</script>

<template>
  <div>
    <div class="flex gap-2">
      <TooltipProvider
        v-for="metric in metrics"
        :key="metric.timestamp"
      >
        <Tooltip>
          <TooltipTrigger>
            <div
              class="h-12 w-2 rounded-full"
              :class="colorsMap[metric.status]"
            />
          </TooltipTrigger>
          <TooltipContent>
            {{ $dayjs(metric.timestamp).format('HH:mm:ss') }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div class="flex justify-between mt-2">
      <span>{{ $dayjs(metrics[0].timestamp).fromNow() }}</span>
      <span>{{ $dayjs(metrics[metrics.length - 1].timestamp).fromNow() }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
