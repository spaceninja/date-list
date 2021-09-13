import '../sass/main.scss';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';
import rawDates from '../data/dates.json';

const datelistContent = document.getElementById('datelist-content');
const initialSortButton = document.getElementById('btn-sort-duration');
const sortButtons = document.querySelectorAll('[data-sort-by]');
const sortButtonsArray = Array.from(sortButtons);
let dates;

//
// Sort an array by key
//
// https://stackoverflow.com/a/14463464
//
const sortByKey = function sortByKey(array, key) {
  return array.sort((a, b) => {
    let x = a[key];
    let y = b[key];

    if (typeof x === 'string') {
      x = x.toLowerCase();
    }
    if (typeof y === 'string') {
      y = y.toLowerCase();
    }
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
};

//
// Parse the date array and add new keys for sorting
//
// Note: In this function we evaluate whether the date is more than a
// month ago, and if it is, we call a different method to generate the
// readable text version of that string.
//
// That's because the fromNow() method from momentJS only shows the
// most significant unit (2 minutes ago, 2 weeks ago, 2 years ago),
// But we want dates like "14 years, 2 months ago".
//
// So we use moment.js for dates less than a month old, and then switch
// to humanizeDuration() otherwise.
//
const parseDates = function parseDates(input) {
  const dateArray = input;

  for (let i = 0; i < dateArray.length; i += 1) {
    const eventDate = moment(dateArray[i].date);
    const diff = eventDate.diff(moment(), 'milliseconds');
    const millisecondsMonth = moment.duration(1, 'months');

    // short duration text
    // http://momentjs.com/docs/#/displaying/fromnow/
    // returns '25 days ago' or '19 hours ago'
    const shortDuration = eventDate.fromNow();

    // long duration text
    // https://github.com/EvanHahn/HumanizeDuration.js
    // returns '31 years, 8 months'
    let longDuration = humanizeDuration(diff, { largest: 2, round: true });

    // add humanizing modifiers to long duration text
    if (diff < 0) {
      // this date is in the past
      longDuration = `${longDuration} ago`;
    } else {
      // this date is in the future
      longDuration = `in ${longDuration}`;
    }

    // decide which duration text to use based on how long the duration is
    if (Math.abs(diff) < millisecondsMonth) {
      // durations shorter than a month
      dateArray[i].duration = shortDuration;
    } else {
      // durations longer than a month
      dateArray[i].duration = longDuration;
    }

    // format date to be human-readable (ll = Sep 4, 1986)
    dateArray[i].calendar = eventDate.calendar(null, { sameElse: 'll' });

    // add month key for sorting (L = 09/04/1986)
    dateArray[i].month = eventDate.calendar(null, { sameElse: 'L' });

    // add diff key for sorting
    dateArray[i].diff = diff;
  }

  return dateArray;
};

//
// Convert date array into HTML
//
const buildHTML = function buildHTML(dateArray) {
  let content = '';

  // add a table row for each item in the date array
  for (let i = 0; i < dateArray.length; i += 1) {
    content +=
      `<tr><td>${dateArray[i].event}</td>` +
      `<td class="num">${dateArray[i].calendar}</td>` +
      `<td class="num">${dateArray[i].duration}</td></tr>`;
  }

  return content;
};

//
// Sort the date array and rebuild the HTML using the new sort
//
const sortBy = function sortBy() {
  sortByKey(dates, this.dataset.sortBy);
  if (this.dataset.sortActive === 'true') {
    if (this.dataset.sortOrder === 'ascending') {
      datelistContent.innerHTML = buildHTML(dates.reverse());
      this.dataset.sortOrder = 'descending';
    } else {
      datelistContent.innerHTML = buildHTML(dates);
      this.dataset.sortOrder = 'ascending';
    }
  } else {
    sortButtonsArray.forEach((e) => {
      e.dataset.sortActive = 'false';
    });
    datelistContent.innerHTML = buildHTML(dates);
    this.dataset.sortActive = 'true';
    this.dataset.sortOrder = 'ascending';
  }
};

//
// Add event listeners to sort buttons
//
sortButtonsArray.forEach((e) => {
  e.addEventListener('click', sortBy);
});

dates = parseDates(rawDates);
sortByKey(dates, initialSortButton.dataset.sortBy);
datelistContent.innerHTML = buildHTML(dates.reverse());
initialSortButton.dataset.sortOrder = 'descending';
initialSortButton.dataset.sortActive = 'true';
