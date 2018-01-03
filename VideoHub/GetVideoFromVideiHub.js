// JavaScript source code

$(document).ready(function () {

    //var tenantUrl = window.location.protocol + '//' + window.location.host;
    //GetIDForChannel(tenantUrl);
    GetAllVideoByID('2b74e3c9-9d87-4413-80a1-2e58fcb4de80');

});

function GetAllVideoByID(channelId) {
    var tenantUrl = window.location.protocol + '//' + window.location.host;
    var ChannelURl = tenantUrl + "/portals/hub/_api/VideoService/Channels(guid'" + channelId + "')/Videos?$orderby=CreatedDate desc&$top=4";
    $.ajax({
        url: ChannelURl,
        type: "GET",
        headers: { "Accept": "application/json;odata=verbose" },

        success: getSessionVideoSucess,
        error: getSessionVideoFailure
    });

}

function getSessionVideoSucess(data) {
    try {
        var property = data.d.results;
        //console.log(property);
        var count = 1;
        var videoUrl = "";
        $.each(property, function (key, value) {
            if (value.Url != undefined || value.Url != null) {
                if (count == 1) {
                    $("#idframe").attr("src", value.Url);
                }
                var url = "<a data-url='" + value.Url + "' href =\"javascript:cargarVideo(\'idframe','" + value.Url + "')\">" +
                    "<video class='heightwidthfix'><source src='" + value.Url + "' type='video/mp4'>" +
                    "Your browser does not support the video tag.</video></a>";

                videoUrl += url;
                count++;
            }

            //alert(count);


        });
        $("#sessionvideo").html(videoUrl);

    }
    catch (ex) {
        console.log(ex);
    }
}

function getSessionVideoFailure(error) {
    console.log("Failed to get Video From Session Video Channel " + JSON.stringify(error));
}


function GetIDForChannel(tenantUrl) {
    $.ajax({
        url: tenantUrl + "/portals/hub/_api/VideoService/Channels",
        type: "GET",
        headers: { "Accept": "application/json;odata=verbose" },

        success: onSucess,
        error: onFailure
    });
}

function onSucess(AllChannel) {

    try {
        var property = AllChannel.d.results;
        //console.log(property);
        if (property.length > 0) {
            $.each(property, function (key, value) {
                if (value.Title == 'Session Video') {
                    var channelId = value.Id;
                    GetAllVideoByID(channelId);
                }
            });
        }
        else {
            $("#idframe").html("Video Channel not found Please contact to Admin");
        }
    }
    catch (ex) {
        console.log(ex);
    }

}

function onFailure(error) {
    console.log("Failed to get Session Video Channel " + JSON.stringify(error));
}

