<script setup lang="ts">

import type { MonitorWithStatus } from '~/lib/model/monitor-with-status.interface'
import type { MonitorMetric } from '~/lib/model/monitor-metric.interface'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'

const { monitor } = defineProps<{ monitor: MonitorWithStatus }>()

const { data: metrics } = await useApiFetch<MonitorMetric[]>(`/monitor/${monitor.id}/metrics`)

const dayjs = useDayjs()
const chartData = computed(() => {
  if (!metrics.value) {
    return []
  }
  return metrics.value.map(metric => ({
    timestamp: dayjs(metric.timestamp).toString(),
    metric: metric.metrics.primary
  })).reverse()
})

</script>

<template>
  <NuxtLink :to="`/monitor/${monitor.id}`">
    <Card class="group">
      <CardContent class="flex flex-row justify-between items-center py-4 gap-4">
        <CardTitle>{{ monitor.name }}</CardTitle>
        <LineChart
          class="h-10 w-96"
          :data="chartData"
          index="timestamp"
          :categories="['metric']"
          :show-tooltip="true"
          :show-grid-line="false"
          :show-legend="false"
          :show-x-axis="false"
          :show-y-axis="false"
        />
        <span
          class="w-4 h-4 rounded-full"
          :class="monitor.status === MonitorStatus.UP ? 'bg-green-500' : 'bg-red-500'"
        />
      </CardContent>
    </Card>
  </NuxtLink>
</template>

<style scoped>

</style>
