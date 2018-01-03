// JavaScript source code

$(document).ready(function () {

    var todayDate = new Date();
    var dateFilter = todayDate.toISOString();

    GetTodayEventsUsingRest(dateFilter);

});

function GetTodayEventsUsingRest(dateFilter) {
    var redirect = _spPageContextInfo.webAbsoluteUrl + "/Lists/Calendar/DispForm.aspx?ID=";
	/*var queryUrl = _spPageContextInfo.webAbsoluteUrl  + "/_api/web/Lists/GetByTitle('Calendar')/items?" +
					"&$filter=(EventDate ge datetime'"+ dateFilter +"')" +
					"&$orderby=ID desc&$top=5";*/
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/ListData.svc/Calendar?" +
        "$filter=(StartTime ge datetime'" + dateFilter + "')" +
        "&$orderby=StartTime asc&$top=3";
    $.ajax({
        url: queryUrl,
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            //var property = data.d.results;
            var property = data.d;
            //console.log(property);
            $.each(property, function (key, value) {
                var eventID = value.Id;
                var title = value.Title;
                var location = value.Location;
                var category = value.CategoryValue;

                var eventStartdate = value.Date;
                var eventStartTime = value.From;
                var eventEndTime = value.To;
                var isFullDayEvent = value.AllDayEvent;


                if (!isFullDayEvent) {

                    var bodyHtml = "<a target='_blank' href='" + redirect + eventID + "'<span class='event_date'><h4 class='evenet_title'><strong>" + title + "</strong></h4></span>" +
                        "<span class='eventbody'><strong>When:&nbsp;</strong>" + eventStartdate + ",  " + eventStartTime + " - " + eventEndTime + "</span>" +
                        "<span class='event_where'><strong>Where:&nbsp;</strong>" + location + "</span></p></a>";
                    $("#marqueeEvent").append(bodyHtml);


                }
                else if (isFullDayEvent) {
                    var bodyHtml = "<a target='_blank' href='" + redirect + eventID + "'<span class='event_date'><h4 class='evenet_title'><strong>" + title + "</strong></h4></span>" +
                        "<span class='eventbody'><strong>When:&nbsp;</strong>" + eventStartdate + " - Full Day" + "</span>" +
                        "<span class='event_where'><strong>Where:&nbsp;</strong>" + location + "</span></p></a>";
                    $("#marqueeEvent").append(bodyHtml);

                }
            });
        },
        error: function (result) {
            console.log("Failed to get Event");
        }
    });
}

function getTodayDateArranged() {
    var objToday = new Date(),
        weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = function () { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
        //dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() : objToday.getDate(),
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    //var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
    var today = dayOfWeek + ", " + curMonth + " " + dayOfMonth + ", " + curYear;

    return today;
}