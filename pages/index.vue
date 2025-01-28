<script setup lang="ts">

import type { MonitorWithStatus } from '~/lib/model/monitor-with-status.interface'

const { data } = await useApiFetch<MonitorWithStatus[]>('/monitor')

</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <MonitorCard v-for="monitor in data" :key="monitor.id" :monitor="monitor" />
  </div>
</template>
