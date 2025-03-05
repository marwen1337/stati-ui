<script setup lang="ts">
import { PencilIcon, TrashIcon } from 'lucide-vue-next'
import { cronToHumanReadable } from '../../lib/utils'
import type { MonitorWithStatus } from '~/lib/model/monitor.interface'
import type { MonitorMetric } from '~/lib/model/monitor-metric.interface'
import StatusHistoryBar from '~/components/monitor/StatusHistoryBar.vue'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'
import StatusBadge from '~/components/utils/StatusBadge.vue'

const route = useRoute()

definePageMeta({
  title: 'Monitor Details'
})

const monitor = await useApiFetchData<MonitorWithStatus>(`/monitor/${route.params.id}`)
  .then((monitor) => {
    if (!monitor.value) {
      throw createError({ statusCode: 404, statusMessage: 'Monitor Not Found' })
    }
    return monitor as Ref<MonitorWithStatus>
  })

const metricsAmount = 100
const metrics = await useApiFetchData<MonitorMetric[]>(`/monitor/${route.params.id}/metrics?limit=${metricsAmount}`).then((metrics) => {
  if (!metrics.value || metrics.value.length < metricsAmount) {
    metrics.value = [...(metrics.value ?? []), ...new Array(metricsAmount - (metrics.value?.length ?? 0)).fill({
      timestamp: '0',
      status: MonitorStatus.UNKNOWN,
      metrics: {
        primary: 0
      }
    })]
  }
  return metrics as Ref<MonitorMetric[]>
}).then((metrics) => {
  metrics.value = metrics.value.reverse()
  return metrics
})

const flattenedMetrics = computed(() => {
  return metrics.value.map(m => ({
    timestamp: m.timestamp,
    ...m.metrics
  }))
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card>
      <CardHeader class="flex flex-row justify-between">
        <div class="flex items-center gap-2">
          <CardTitle>
            {{ monitor.name }}
          </CardTitle>
          <Badge>{{ cronToHumanReadable(monitor.cronSchedule) }}</Badge>
          <Badge>{{ monitor.type }}</Badge>
          <StatusBadge :up="monitor.status === MonitorStatus.UP">
            {{ monitor.status }}
          </StatusBadge>
        </div>
        <div class="flex gap-4 items-center">
          <Button variant="secondary" disabled>
            <PencilIcon />
            Edit
          </Button>
          <Button variant="destructive" disabled>
            <TrashIcon />
            Delete
          </Button>
        </div>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusHistoryBar :metrics="metrics" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Metric History</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          :data="flattenedMetrics"
          index="timestamp"
          :categories="['primary']"
          :x-formatter="(tick, i) => $dayjs(flattenedMetrics[i].timestamp).format('HH:mm:ss')"
        />
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>

</style>
