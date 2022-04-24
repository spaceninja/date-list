<template>
  <tr>
    <td>{{ event }}</td>
    <td class="num">{{ readable }}</td>
    <td class="num">
      <span v-if="diff < 0">{{ age }} ago</span><span v-else>in {{ age }}</span>
    </td>
  </tr>
</template>

<script setup>
import { defineProps } from 'vue';

/* eslint-disable no-unused-vars */
const props = defineProps({
  event: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  diff: {
    type: Number,
    required: true,
  },
  readable: {
    type: String,
    required: true,
  },
});
</script>
