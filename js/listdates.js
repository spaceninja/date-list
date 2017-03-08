/* global moment, humanizeDuration */
var content = "";
var xhr = new XMLHttpRequest();

// Convert date array into HTML
var listDates = function(dates) {
    for (var i = 0; i < dates.length; i++) {
        var durationText = "";
        var eventDate = moment(dates[i].date);
        var diff = eventDate.diff(moment(), 'milliseconds');
        var millisecondsMonth = moment.duration(1, 'months');

        // use moment.js's fromNow() for durations shorter than a month
        var shortDuration = eventDate.fromNow();

        // use humanizeDuration for durations longer than a month
        var longDuration = humanizeDuration(diff, { largest: 2, round: true });

        // add human-readable duration text
        longDuration = diff < 0 ? longDuration + " ago" : "in " + longDuration;

        // decide which text to use based on how long the duration is
        durationText = Math.abs(diff) < millisecondsMonth ?
                       shortDuration :
                       longDuration;

        // construct the HTML table row
        content += "<tr>" +
                   "<td>" + dates[i].event + "</td>" +
                   "<td class='num'>" + eventDate.calendar(null, {sameElse: 'll'}) + "</td>" +
                   "<td class='num'>" + durationText + "</td>" +
                   "</tr>";
    }
};

// Prepare the Ajax request
xhr.open('GET', 'data/dates.json', true);

// Handle the Ajax response
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
        // Parse the JSON data
        var dates = JSON.parse(xhr.responseText);

        // Build the date list
        listDates(dates);

        // Write the date list to the browser
        document.getElementById('datelist-content').innerHTML = content;
    } else {
        // We reached our target server, but it returned an error

        // error message
        content = 'Whoops! Something went wrong. Please try again.';

        // Write the error message to the browser
        document.getElementById('datelist-error').innerHTML = content;
    }
};

// Handle an Ajax error
xhr.onerror = function() {
    // There was a connection error of some sort

    // error message
    content = 'Whoops! We couldn\'t reach the server. Please try again.';

    // Write the error message to the browser
    document.getElementById('datelist-error').innerHTML = content;
};

// Send the Ajax request
xhr.send();
