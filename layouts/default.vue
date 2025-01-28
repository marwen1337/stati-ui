<script setup lang="ts">
import Navbar from '~/components/navigation/Navbar.vue'

const route = useRoute()
</script>
<template>
  <div>
    <Navbar />
    <main class="mx-8 my-4">
      <div class="flex justify-between items-center gap-4">
        <h2 v-if="route.meta.title" class="mb-4">
          {{ route.meta.title }}
        </h2>
        <div id="navbarTeleportSlot" />
      </div>
      <slot />
    </main>
  </div>
</template>
