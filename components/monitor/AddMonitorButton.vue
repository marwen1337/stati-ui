<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import * as z from 'zod'
import { type FormContext, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import cronstrue from 'cronstrue'
import { CronExpressionParser } from 'cron-parser'
import { MonitorType } from '~/lib/model/monitor-type.enum'
import { AutoForm } from '~/components/ui/auto-form'
import type { Monitor, MonitorWithStatus } from '~/lib/model/monitor.interface'
import { MonitorStatus } from '~/lib/model/monitor-status.enum'
import type { AgentWithConnectionStatus } from '~/lib/model/agent.interface'
import type { ZodObjectOrWrapped } from '~/components/ui/auto-form/utils'

const emit = defineEmits<{(e: 'created', monitor: MonitorWithStatus): void }>()

const open = ref(false)

const agents = await useApiFetchData<AgentWithConnectionStatus[]>('/agent')

const agentNames = computed(() => {
  return agents.value?.map(a => a.name) ?? []
})

const getAgentIdByName = (agentName: string): string | undefined => {
  return agents.value?.find(a => a.name === agentName)?.id
}

const testSchemaMap: Record<MonitorType, ZodObjectOrWrapped> = {
  [MonitorType.HTTP]: z.object({
    url: z.string().default('https://example.com/')
  }),
  [MonitorType.CPU]: z.object({
    maxUsageThreshold: z.number().default(1)
  }),
  [MonitorType.TCP]: z.object({
    host: z.string().default('localhost'),
    port: z.number().min(0).max(65535).default(80)
  }),
  [MonitorType.PING]: z.object({
    host: z.string().default('localhost')
  })
}
const testFormMap: Record<MonitorType, FormContext> = {
  [MonitorType.HTTP]: useForm({ validationSchema: toTypedSchema(testSchemaMap[MonitorType.HTTP]) }),
  [MonitorType.CPU]: useForm({ validationSchema: toTypedSchema(testSchemaMap[MonitorType.CPU]) }),
  [MonitorType.TCP]: useForm({ validationSchema: toTypedSchema(testSchemaMap[MonitorType.TCP]) }),
  [MonitorType.PING]: useForm({ validationSchema: toTypedSchema(testSchemaMap[MonitorType.PING]) })
}

const currentMonitorConfigSchema = computed(() => {
  if (!form.values.type) {
    return z.object({})
  }
  return testSchemaMap[form.values.type]
})

const currentMonitorConfigForm = computed(() => {
  if (!form.values.type) {
    return useForm({ validationSchema: toTypedSchema(z.object({})) })
  }
  return testFormMap[form.values.type]
})

const schema = z.object({
  name: z.string().min(3).max(64),
  agent: z.enum(agentNames.value as [string, ...string[]]),
  type: z.nativeEnum(MonitorType).default(MonitorType.HTTP),
  cronSchedule: z.string().default('0 * * * * *')
})

const form = useForm({
  validationSchema: toTypedSchema(schema),
  keepValuesOnUnmount: true
})

const createMonitor = async () => {
  const values = form.values
  const configuration = currentMonitorConfigForm.value.values
  const {
    data,
    error
  } = await useApiFetch<Monitor>('/monitor', {
    method: 'POST',
    body: {
      ...values,
      agentId: getAgentIdByName(values.agent),
      configuration: JSON.stringify(configuration)
    }
  })
  if (error.value) {
    return
  }
  open.value = false
  emit('created', {
    ...data.value!,
    status: MonitorStatus.UP
  })
}

const cronScheduleHumanReadable = computed(() => {
  try {
    CronExpressionParser.parse(form.values.cronSchedule ?? '')
  } catch (e) {
    form.setFieldError('cronSchedule', 'Invalid expression')
    return ''
  }
  return cronstrue.toString(form.values.cronSchedule!)
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="ghost">
        <PlusIcon />
        Add Monitor
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Add monitor</DialogTitle>
        <DialogDescription>
          Add a new monitor to your stati instance
        </DialogDescription>
      </DialogHeader>
      <div class="my-4 grid gap-4">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <DialogTitle>Settings</DialogTitle>
            <AutoForm
              class="flex flex-col gap-4"
              :form="form"
              :schema="schema"
              :field-config="{
                cronSchedule: {description: cronScheduleHumanReadable}
              }"
            />
          </div>
          <Separator class="shrink" orientation="vertical" />
          <div class="flex-1">
            <DialogTitle>Monitor Configuration</DialogTitle>
            <AutoForm :schema="currentMonitorConfigSchema" :form="currentMonitorConfigForm" />
          </div>
        </div>
        <Button class="col-span-full mt-4" type="submit" @click="createMonitor">
          Save changes
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
