<script setup lang="ts">
import { PencilIcon, TrashIcon } from 'lucide-vue-next'
import { cronToHumanReadable } from '../../lib/utils'
import type { MonitorWithStatus } from '~/lib/model/monitor.interface'
import type { MonitorMetric } from '~/lib/model/monitor-metric.interface'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'
import StatusBadge from '~/components/utils/StatusBadge.vue'
import StatusHistoryBar from '~/components/monitor/StatusHistoryBar.vue'

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

const titleCardHeader = useTemplateRef('titleCardHeader')
const metricsAmount = ref(0)
const {
  data: metrics,
  status: metricsStatus,
  execute: metricsExecute
} = await useApiFetch<MonitorMetric[]>(`/monitor/${route.params.id}/metrics`, {
  immediate: false,
  query: { amount: metricsAmount }
})

const flattenedMetrics = computed(() => {
  return (metrics.value ?? []).map(m => ({
    timestamp: m.timestamp,
    ...m.metrics
  }))
})

onMounted(() => {
  if (titleCardHeader.value) {
    const widthPerItem = 16
    const rect = titleCardHeader.value.$el.getBoundingClientRect()
    const style = window.getComputedStyle(titleCardHeader.value.$el)
    const paddingLeft = parseFloat(style.paddingLeft)
    const paddingRight = parseFloat(style.paddingRight)
    const widthWithoutPadding = rect.width - paddingLeft - paddingRight
    metricsAmount.value = Math.floor(widthWithoutPadding / widthPerItem)
    metricsExecute()
  }
})

</script>

<template>
  <div class="flex flex-col gap-4">
    <Card>
      <CardHeader ref="titleCardHeader" class="flex flex-row justify-between">
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
    <Card v-if="metricsStatus === 'success'">
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusHistoryBar :metrics="metrics ?? []" />
      </CardContent>
    </Card>
    <Card v-if="metricsStatus === 'success'">
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
