<script setup lang="ts">

import { PlusIcon } from 'lucide-vue-next'
import * as z from 'zod'
import { AutoForm } from '~/components/ui/auto-form'
import type { Agent, AgentWithConnectionStatus } from '~/lib/model/agent.interface'
import { ToastAction, useToast } from '~/components/ui/toast'

const emit = defineEmits<{(e: 'created', agent: AgentWithConnectionStatus): void }>()

const open = ref(false)

const formSchema = z.object({
  name: z.string().min(3).max(64)
})

const { toast } = useToast()

const createAgent = async (values: object) => {
  const { data, error } = await useApiFetch<Agent & { accessKey: string }>('/agent', {
    method: 'POST',
    body: values
  })
  if (error.value || !data.value) {
    return
  }
  open.value = false
  emit('created', { ...data.value, isConnected: false })
  toast({
    title: 'Agent created',
    description: `AccessKey: ${data.value.accessKey}`,
    action: h(ToastAction, {
      altText: 'Copy',
      onClick: () => {
        navigator.clipboard.writeText(data.value.accessKey)
      }
    }, {
      default: () => 'Copy'
    })
  })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="ghost">
        <PlusIcon />
        Add Agent
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add agent</DialogTitle>
        <DialogDescription>
          Add a new agent to your stati instance
        </DialogDescription>
      </DialogHeader>
      <div class="my-4">
        <AutoForm
          class="flex flex-col gap-4"
          :schema="formSchema"
          @submit="createAgent"
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
