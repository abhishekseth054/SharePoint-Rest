// JavaScript source code

$(document).ready(function () {
    GetCity();
});

function getweather(city) {
    var queryUrl = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=%22" + city + "%22)&format=json&env=store://datatables.org/alltableswithkeys";
    $.ajax({
        url: queryUrl,
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {

            var property = data.query.results.channel;
            // console.log(property);

            var units = property.units;
            var distanceunit = units.distance;
            var pressureunit = units.pressure;
            var speedunit = units.speed;
            var temperatureunit = units.temperature;

            var condition = property.item.condition;
            var date = condition.date;
            var temp = condition.temp;
            temp = convertFToC(temp);
            var text = condition.text;

            var description = property.item.description;
            var imageUrl = description.split('[')[2].split('\n')[0].split('"')[1];

            var location = property.location;
            var city = location.city;
            var country = location.country;
            var region = location.region;

            var hightemp = property.item.forecast[0].high;
            hightemp = convertFToC(hightemp);
            var lowtemp = property.item.forecast[0].low;
            lowtemp = convertFToC(lowtemp);


            var todayweatherDetailsHtml = "<div class='col-md-12 nopadding'><h2>" + city + "</h2><p class='region'>" + region + ", " + country + "</p>" +
                "<p><span>" + date + "</span></p>" +
                "<img src='" + imageUrl + "'/><span class='weather_type'>" + text + "</span>" +
                "<p class='high_low'><i class='fa fa-long-arrow-right up'></i><span>" + hightemp + "</span><i class='fa fa-long-arrow-right down'></i><span>" + lowtemp + "</span>" +
                "<p class='avg_temp'>" + temp + "</p></div>";

            //$("#todayweatherdetails").html(todayweatherDetailsHtml);

            var forcast = property.item.forecast;


            //$("#divForcast").html(bodyHtml);

            var astronomy = property.astronomy;
            var sunrise = astronomy.sunrise;
            var sunset = astronomy.sunset;

            var wind = property.wind;
            var chill = wind.chill;
            var direction = wind.direction;
            var speed = wind.speed;

            var astronomyHtml = "<div class='col-md-12 nopadding sunset_raise_cover'><img src='http://www.forecast.bg/icons/113.png'><div class='sunset_raise'><p>Sunrise:" + sunrise + "</p><p>Sunset:" + sunset + "</p></div></div></div>";

            //$("#astronomy").html(astronomyWindhtml);

            var latitude = property.item.lat;
            var longitude = property.item.long;

            //var latlongHtml = "<div><span>Latitude: " + latitude + "°" + "</span></p><p><span>Latitude: " + longitude + "°" + "</span></div>"				
            //$("#latlong").html(latlongHtml);

            var atmosphere = property.atmosphere;
            var humidity = atmosphere.humidity;
            var pressure = atmosphere.pressure;
            var visibility = atmosphere.visibility;

            //var atmosphereHtml = "<div><span>Humidity: " + humidity + "%" + "</span></p><p><span>Pressure: " + pressure + pressureunit  + "</span></div>" 				
            //$("#atmosphere").html(atmosphereHtml);	

            var completeHTMLForOneCity = "<div class='col-md-6 weather_item'>" + todayweatherDetailsHtml + astronomyHtml + "</div>";
            $("#weatherReport").append(completeHTMLForOneCity);
        },

        error: function (result) { console.log("Failed to get Apointments details"); }
    });
}


function convertFToC(fTempVal) {
    var cTempVal = (fTempVal - 32) * (5 / 9);
    return cTempVal.toFixed(2) + "°C";
}

function GetCity() {
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('City')/items",
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {

            var property = data.d.results;
            $.each(property, function (key, value) {
                var city = value.Title;
                getweather(city);

            });

        },
        error: function (result) { console.log("Fail to get City Name"); }
    });
}


/**********************************************************************/

