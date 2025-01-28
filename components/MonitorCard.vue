<script setup lang="ts">

import { TrashIcon } from 'lucide-vue-next'
import type { MonitorWithStatus } from '~/lib/model/monitor.interface'
import type { MonitorMetric } from '~/lib/model/monitor-metric.interface'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'

const emit = defineEmits<{(e: 'deleted', id: string): void }>()
const { monitor } = defineProps<{ monitor: MonitorWithStatus }>()

const { data: metrics } = await useApiFetch<MonitorMetric[]>(`/monitor/${monitor.id}/metrics?limit=10`)

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

const deleteMonitor = async () => {
  await useApiFetchData(`/monitor/${monitor.id}`, { method: 'DELETE' })
  emit('deleted', monitor.id)
}

</script>

<template>
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
      <div class="flex items-center gap-2">
        <span
          class="w-4 h-4 rounded-full"
          :class="monitor.status === MonitorStatus.UP ? 'bg-green-500' : 'bg-red-500'"
        />
        <Button variant="ghost" @click="deleteMonitor">
          <TrashIcon />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
