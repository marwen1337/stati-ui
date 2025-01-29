<script setup lang="ts">

import { PlusIcon } from 'lucide-vue-next'
import * as z from 'zod'
import { MonitorType } from '~/lib/model/monitor-type.enum'
import { AutoForm } from '~/components/ui/auto-form'
import type { Monitor, MonitorWithStatus } from '~/lib/model/monitor.interface'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'
import type { AgentWithConnectionStatus } from '~/lib/model/agent.interface'

const emit = defineEmits<{(e: 'created', monitor: MonitorWithStatus): void }>()

const open = ref(false)

const agents = await useApiFetchData<AgentWithConnectionStatus[]>('/agent')

const agentNames = computed(() => {
  return agents.value?.map(a => a.name) ?? []
})

const getAgentIdByName = (agentName: string): string | undefined => {
  return agents.value?.find(a => a.name === agentName)?.id
}

const formSchema = z.object({
  name: z.string().min(3).max(64),
  agent: z.enum(agentNames.value as [string, ...string[]]),
  type: z.nativeEnum(MonitorType).default(MonitorType.HTTP),
  configuration: z.string().min(2).max(1024).default('{"url": "https://google.com"}'),
  intervalSeconds: z.number().min(5).max(86400).default(60)
})

const createMonitor = async (values: object) => {
  const { data, error } = await useApiFetch<Monitor>('/monitor', {
    method: 'POST',
    body: {
      ...values,
      agentId: getAgentIdByName(values.agent)
    }
  })
  if (error.value) {
    return
  }
  open.value = false
  emit('created', { ...data.value!, status: MonitorStatus.UP })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="ghost">
        <PlusIcon />
        Add Monitor
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add monitor</DialogTitle>
        <DialogDescription>
          Add a new monitor to your stati instance
        </DialogDescription>
      </DialogHeader>
      <div class="my-4">
        <AutoForm
          class="flex flex-col gap-4"
          :schema="formSchema"
          :field-config="{
            configuration: {label: 'Configuration', component: 'textarea'},
          }"
          @submit="createMonitor"
        >
          <Button type="submit">
            Save changes
          </Button>
        </AutoForm>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
