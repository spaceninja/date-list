var xhr=new XMLHttpRequest,listDates=function(e){for(var t="",n=0;n<e.length;n++){var r="",a=moment(e[n].date),o=a.diff(moment(),"milliseconds"),s=moment.duration(1,"months"),l=a.fromNow(),d=humanizeDuration(o,{largest:2,round:!0});o<0?d+=" ago":d="in "+d,r=Math.abs(o)<s?l:d,t+="<tr><td>"+e[n].event+"</td><td class='num'>"+a.calendar(null,{sameElse:"ll"})+"</td><td class='num'>"+r+"</td></tr>"}return t};xhr.open("GET","data/dates.json",!0),xhr.onload=function(){if(xhr.status>=200&&xhr.status<400){var e=JSON.parse(xhr.responseText);document.getElementById("datelist-content").innerHTML=listDates(e)}else{var t="Whoops! Something went wrong. Please try again.";document.getElementById("datelist-error").innerHTML="Whoops! Something went wrong. Please try again."}},xhr.onerror=function(){var e="Whoops! We couldn't reach the server. Please try again.";document.getElementById("datelist-error").innerHTML="Whoops! We couldn't reach the server. Please try again."},xhr.send();