<template>
  <div class="flex justify-between items-center">
    <div class="flex justify-between items-center h-16 w-72 px-6"></div>
    <div class="flex justify-end items-center px-5 h-16 gap-4">
      <LocaleSwitcher />
      <AppHeaderUserNav />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppHeaderUserNav from './AppHeaderUserNav.vue';
import { LocaleSwitcher } from '@/components';
</script>

<style scoped></style>
