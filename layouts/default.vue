<script setup lang="ts">
import Navbar from '~/components/navigation/Navbar.vue'
</script>
<template>
  <div>
    <Navbar />
    <main class="mx-8 my-4">
      <slot />
    </main>
  </div>
</template>
