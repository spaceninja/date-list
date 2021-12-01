<template>
  <table>
    <thead>
      <tr>
        <DataTableHeader title="Event" value="event" />
        <DataTableHeader title="Date" value="month" />
        <DataTableHeader title="Age" value="diff" />
      </tr>
    </thead>
    <tbody>
      <tr v-if="!sortedDates.length">
        <td colspan="3">
          <p>Loading…</p>
        </td>
      </tr>
      <DateTableRow v-for="date in sortedDates" :key="date.key" v-bind="date" />
    </tbody>
  </table>
</template>

<script setup>
import { onMounted } from 'vue';
import { sortedDates, fetchDates } from '../../composables/useDate';
import DataTableHeader from '../DataTableHeader/DataTableHeader.vue';
import DateTableRow from '../DateTableRow/DateTableRow.vue';

onMounted(() => {
  fetchDates();
});
</script>
