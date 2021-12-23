<template>
  <svg viewBox="0 0 100 200" width="100" height="200">
    <polyline v-if="showAscending" points="20 50, 50 20, 80 50" />
    <line x1="50" y1="20" x2="50" y2="180" />
    <polyline v-if="showDescending" points="20 150, 50 180, 80 150" />
  </svg>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  sortOrder: {
    type: String,
    required: true,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

const showAscending = computed(() => {
  if (!props.isCurrent) return true;
  return props.sortOrder === 'ascending' && props.isCurrent;
});

const showDescending = computed(() => {
  if (!props.isCurrent) return true;
  return props.sortOrder === 'descending' && props.isCurrent;
});
</script>
