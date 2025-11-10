<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { RouterView } from 'vue-router';

import { useTaskNotifications } from '@/modules/tasks/composables/useTaskNotifications';

useTaskNotifications();
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
</template>
