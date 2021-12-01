<template>
  <th
    scope="col"
    role="columnheader"
    :aria-sort="sortBy === value ? sortOrder : 'none'"
  >
    {{ title }}
    <button type="button" @click="setSort(value, newSortOrder)">
      <SortIcon :sort-order="sortOrder" :is-current="sortBy === value" />
      <span class="visually-hidden">
        Sort by {{ title }} in {{ newSortOrder }} order
      </span>
    </button>
  </th>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { sortBy, sortOrder, setSort } from '../../composables/useDate';
import SortIcon from '../SortIcon/SortIcon.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const newSortOrder = computed(() => {
  const reverseSortOrder =
    sortOrder.value !== 'ascending' ? 'ascending' : 'descending';
  return sortBy.value === props.value ? reverseSortOrder : 'descending';
});
</script>
