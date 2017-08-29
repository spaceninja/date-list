/* global moment, humanizeDuration */
const xhr = new XMLHttpRequest();

// Convert date array into HTML
const listDates = function(dates) {
    'use strict';
    let content = "";

    for (let i = 0; i < dates.length; i++) {
        const eventDate = moment(dates[i].date);
        const diff = eventDate.diff(moment(), 'milliseconds');
        const millisecondsMonth = moment.duration(1, 'months');
        let durationText = "";

        // http://momentjs.com/docs/#/displaying/fromnow/
        // returns '25 days ago' or '19 hours ago'
        const shortDuration = eventDate.fromNow();

        // https://github.com/EvanHahn/HumanizeDuration.js
        // returns '31 years, 8 months'
        let longDuration = humanizeDuration(diff, { largest: 2, round: true });

        // add human-readable duration text
        if (diff < 0) {
            // dates in the past
            longDuration = longDuration + " ago";
        } else {
            // dates in the future
            longDuration = "in " + longDuration;
        }

        // decide which text to use based on how long the duration is
        if (Math.abs(diff) < millisecondsMonth) {
            // durations shorter than a month
            durationText = shortDuration;
        } else {
            // durations longer than a month
            durationText = longDuration;
        }

        // construct the HTML table row
        content += "<tr>" +
                   "<td>" + dates[i].event + "</td>" +
                   "<td class='num'>" + eventDate.calendar(null, {sameElse: 'll'}) + "</td>" +
                   "<td class='num'>" + durationText + "</td>" +
                   "</tr>";

    }
    return content;
};

// Prepare the Ajax request
xhr.open('GET', 'data/dates.json', true);

// Handle the Ajax response
xhr.onload = function() {
    'use strict';

    // We got a good response from the server
    if (xhr.status >= 200 && xhr.status < 400) {
        const dates = JSON.parse(xhr.responseText);
        document.getElementById('datelist-content').innerHTML = listDates(dates);

    // We reached our target server, but it returned an error
    } else {
        const error = 'Whoops! Something went wrong. Please try again.';
        document.getElementById('datelist-error').innerHTML = error;
    }
};

// Handle an Ajax connection error
xhr.onerror = function() {
    'use strict';
    const error = 'Whoops! We couldn\'t reach the server. Please try again.';
    document.getElementById('datelist-error').innerHTML = error;
};

// Send the Ajax request
xhr.send();
