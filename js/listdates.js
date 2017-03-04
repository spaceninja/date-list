/* global moment, humanizeDuration */
var content = "";
var dates = [
    { event: "Vandehey, PopPop", date: "1922-11-26" },
    { event: "Vandehey, Grammy", date: "1926-11-9" },
    { event: "Wedding, Grammy &amp; PopPop", date: "1947-12-19" },
    { event: "Vandehey, Ann", date: "1948-1-18" },
    { event: "Vandehey, Ted", date: "1948-9-20" },
    { event: "Stockman, Jeff", date: "1956-8-26" },
    { event: "Stockman, Amy", date: "1957-9-3" },
    { event: "MacCartney, Jill", date: "1966-9-10" },
    { event: "MacCartney, Eric", date: "1970-5-12" },
    { event: "Wedding, Ann &amp; Ted", date: "1973-7-6" },
    { event: "Johnson, Miles", date: "1975-7-8" },
    { event: "McManus, Khrynn", date: "1976-11-2" },
    { event: "Achterman, Daniel", date: "1977-8-15" },
    { event: "Olson, Aaron", date: "1978-1-31" },
    { event: "Stockman, David", date: "1978-3-5" },
    { event: "Vandehey, Scott", date: "1978-6-1" },
    { event: "Olson, Kat", date: "1978-7-25" },
    { event: "Prew, KT", date: "1978-8-28" },
    { event: "Vandehey, Annie", date: "1979-8-22" },
    { event: "Hatfield, Melanie", date: "1979-10-21" },
    { event: "Stockman, Rose", date: "1980-9-4" },
    { event: "Stockman, Zach", date: "1981-4-18" },
    { event: "Vandehey, Ryan &amp; Sean", date: "1981-5-2" },
    { event: "First Website-ish", date: "1996-1-1" },
    { event: "Scott graduates HS", date: "1996-6-30" },
    { event: "Scott and KT meet", date: "1996-9-25" },
    { event: "Yellow5.com", date: "1997-11-4" },
    { event: "Scott and Annie meet", date: "1998-6-26" },
    { event: "First blog post", date: "1999-3-1" },
    { event: "Spaceninja.com", date: "1999-6-16" },
    { event: "MacCartney, Gavin", date: "2000-4-2" },
    { event: "Scott graduates PSU", date: "2000-6-30" },
    { event: "Scott's first web job (RR)", date: "2001-10-11" },
    { event: "Vandehey, Leilani", date: "2002-6-14" },
    { event: "Scott and Annie get engaged", date: "2002-8-22" },
    { event: "Wedding, Dave &amp; Rose", date: "2003-8-9" },
    { event: "Wedding, Urn &amp; Kat", date: "2003-8-30" },
    { event: "Wedding, Annie &amp; Scott", date: "2003-9-12" },
    { event: "Stockman, Oskar", date: "2004-9-10" },
    { event: "Stockman, Milo", date: "2007-1-26" },
    { event: "Vandehey, Zoe", date: "2007-2-22" },
    { event: "Stockman, Theo", date: "2009-1-27" },
    { event: "Vandehey, John", date: "2013-3-22" },
    { event: "Scott starts at Say Media", date: "2015-5-18" },
    { event: "Vandehey, Gemma", date: "2016-11-7" },
    { event: "Sasaki-Stockman, Shelby", date: "2016-11-9" },
    { event: "Kirk, James T", date: "2233-03-22" },
];

var listDates = function() {
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

    content += "<tr>" +
               "<td>" + dates[i].event + "</td>" +
               "<td class='num'>" + eventDate.calendar(null, {sameElse: 'll'}) + "</td>" +
               "<td class='num'>" + durationText + "</td>" +
               "</tr>";
    }
};

// Build the date list
listDates();

// Write the date list to the browser
document.getElementById('datelist-content').innerHTML = content;
