/* global moment, humanizeDuration */
const datelistContent = document.getElementById('datelist-content');
const datelistError = document.getElementById('datelist-error');
const sortButtons = Array.from(document.querySelectorAll('[data-sort-by]'));
const xhr = new XMLHttpRequest();
let dates;

// Sort an array by key
// https://stackoverflow.com/a/14463464
const sortByKey = function(array, key) {
    'use strict';

    return array.sort(function(a, b) {
        let x = a[key];
        let y = b[key];

        if (typeof x == "string") {
            x = x.toLowerCase();
        }
        if (typeof y == "string") {
            y = y.toLowerCase();
        }

        return x < y ? -1 : x > y ? 1 : 0;
    });
}

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
const parseDates = function(dateArray) {
    'use strict';

    for (let i = 0; i < dateArray.length; i++) {
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
            longDuration = longDuration + " ago";
        } else {
            // this date is in the future
            longDuration = "in " + longDuration;
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
        dateArray[i].calendar = eventDate.calendar(null, {sameElse: 'll'});

        // add month key for sorting (L = 09/04/1986)
        dateArray[i].month = eventDate.calendar(null, {sameElse: 'L'});

        // add diff key for sorting
        dateArray[i].diff = diff;
    }

    return dateArray;
};

// Convert date array into HTML
const buildHTML = function(dateArray) {
    'use strict';
    let content = "";

    // add a table row for each item in the date array
    for (let i = 0; i < dateArray.length; i++) {
        content += "<tr>" +
                   "<td>" + dateArray[i].event + "</td>" +
                   "<td class='num'>" + dateArray[i].calendar + "</td>" +
                   "<td class='num'>" + dateArray[i].duration + "</td>" +
                   "</tr>";

    }

    return content;
}

// Sort the date array and rebuild the HTML using the new sort
const sortBy = function() {
    'use strict';
    const sortedDates = sortByKey(dates, this.dataset.sortBy);
    datelistContent.innerHTML = buildHTML(sortedDates);
}

// Add click event to trigger sorting on an element
const enableSorting = function(e) {
    'use strict';
    e.addEventListener('click', sortBy);
}

// Add event listeners to sort buttons
sortButtons.forEach(enableSorting);

// Prepare the Ajax request
xhr.open('GET', 'data/dates.json', true);

// Handle the Ajax response
xhr.onload = function() {
    'use strict';

    // We got a good response from the server
    if (xhr.status >= 200 && xhr.status < 400) {

        // parse the dates
        dates = parseDates(JSON.parse(xhr.responseText));

        // print the dates
        datelistContent.innerHTML = buildHTML(dates);

    // We reached our target server, but it returned an error
    } else {
        const error = 'Whoops! Something went wrong. Please try again.';
        datelistError.innerHTML = error;
    }
};

// Handle an Ajax connection error
xhr.onerror = function() {
    'use strict';
    const error = 'Whoops! We couldn\'t reach the server. Please try again.';
    datelistError.innerHTML = error;
};

// Send the Ajax request
xhr.send();
