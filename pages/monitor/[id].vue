<script setup lang="ts">
import { PencilIcon, TrashIcon } from 'lucide-vue-next'
import { cronToHumanReadable } from '~/lib/utils'
import type { MonitorWithStatus } from '~/lib/model/monitor.interface'
import type { MonitorMetric } from '~/lib/model/monitor-metric.interface'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'
import StatusBadge from '~/components/utils/StatusBadge.vue'
import StatusHistoryBar from '~/components/monitor/StatusHistoryBar.vue'
import { useToast } from '~/components/ui/toast/use-toast'

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

const historyDurationOptions: Record<string, string> = {
  '5 minutes': String(new Date(Date.now() - 300 * 1000).getTime()),
  '1 hour': String(new Date(Date.now() - 3600 * 1000).getTime()),
  '24 hours': String(new Date(Date.now() - 24 * 3600 * 1000).getTime()),
  '30 days': String(new Date(Date.now() - 30 * 24 * 3600 * 1000).getTime())
}
const currentHistoryDurationOption = ref<string>(historyDurationOptions['1 hour'])
const titleCardHeader = useTemplateRef('titleCardHeader')
const metricsAmount = ref(0)
const {
  data: rawMetrics,
  execute: metricsExecute
} = await useApiFetch<MonitorMetric[]>(`/monitor/${route.params.id}/metrics`, {
  immediate: false,
  query: { amount: metricsAmount, from: currentHistoryDurationOption }
})

const metrics = computed<MonitorMetric[]>(() => {
  return rawMetrics.value ?? []
})

const flattenedMetrics = computed(() => {
  return metrics.value.map(m => ({
    timestamp: m.timestamp,
    ...m.metrics
  }))
})

const { toast } = useToast()
const deleteMonitor = () => {
  useApiFetchData(`/monitor/${monitor.value.id}`, { method: 'DELETE' }).then(() => {
    toast({ title: 'Monitor deleted', description: `Deleted monitor ${monitor.value.name}` })
    navigateTo('/monitor')
  })
}

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
          <Button variant="destructive" @click="deleteMonitor">
            <TrashIcon />
            Delete
          </Button>
        </div>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <CardTitle>Status History</CardTitle>
        <Select v-model="currentHistoryDurationOption">
          <SelectTrigger class="w-auto">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="(value, key) in historyDurationOptions" :key="key" :value="value">
              {{ key }}
            </SelectItem>
          </SelectContent>
        </Select>
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
          :show-legend="false"
          :y-domain="[0, undefined]"
        />
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>

</style>
