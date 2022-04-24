import { ref, computed } from 'vue';
import kebabCase from 'lodash.kebabcase';
import parseISO from 'date-fns/parseISO';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import format from 'date-fns/format';
import humanizeDuration from 'humanize-duration';
import rawDates from '../data/dates.json';

export const allDates = ref([]);
export const sortBy = ref('diff');
export const sortOrder = ref('ascending');

/**
 * Get Sorted Dates
 *
 * Given an array of date objects, a sort method, and a sort order,
 * returns a sorted array of dates.
 *
 * @see https://stackoverflow.com/a/14463464/363013
 *
 * @param {Array} dateArray
 * @param {string} sortKey
 * @param {string} sortOrder
 * @returns Array
 */
const getSortedDates = (dateArray, sortKey, sortDir) => {
  const sortedDateArray = [...dateArray].sort((a, b) => {
    let x = a[sortKey];
    let y = b[sortKey];

    if (typeof x === 'string') {
      x = `${x}`.toLowerCase();
    }
    if (typeof y === 'string') {
      y = `${y}`.toLowerCase();
    }

    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  });

  return sortDir === 'ascending' ? sortedDateArray.reverse() : sortedDateArray;
};

/**
 * Sorted and Filtered Dates
 *
 * Computed property to sort and filter the `allDates` set.
 *
 * @returns Array
 */
export const sortedDates = computed(() =>
  getSortedDates(allDates.value, sortBy.value, sortOrder.value)
);

/**
 * Set Sorting Method
 *
 * Updates the `sortBy` and `sortOrder` refs with the given sort values.
 *
 * @param {string} newSortBy
 * @param {string} newSortOrder
 */
export const setSort = (newSortBy, newSortOrder) => {
  sortBy.value = newSortBy;
  sortOrder.value = newSortOrder;
};

/**
 * Parse the date array to add new keys for sorting
 *
 * @param {Array} dateArray
 * @returns Array
 */
export const fetchDates = () => {
  const parsedDates = rawDates.map((date) => {
    const mutableDate = { ...date };
    const parsedDate = parseISO(mutableDate.date);
    const difference = differenceInMilliseconds(parsedDate, Date.now());

    // add kebab-case ID for use as a Vue key
    mutableDate.key = kebabCase(mutableDate.event);

    // format date to be human-readable (Aug 22, 1979)
    mutableDate.readable = format(parsedDate, 'PP');

    // format distance to be human-readable (42 years ago)
    mutableDate.age = humanizeDuration(difference, {
      largest: 2,
      round: false,
    });

    // add month key for sorting (P = 08/22/1979)
    mutableDate.month = format(parsedDate, 'P');

    // add diff key for sorting
    mutableDate.diff = difference;

    return mutableDate;
  });

  allDates.value = parsedDates;
};
