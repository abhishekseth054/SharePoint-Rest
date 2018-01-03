// JavaScript source code
$(document).ready(function () {
    GetMyProfileDetails();
});

function GetMyProfileDetails() {
    var email = "";
    try {
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/sp.userprofiles.peoplemanager/getmyproperties",
            type: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                var property = data.d.UserProfileProperties.results;
                console.log(property);
                for (var i = 0; i < property.length; i++) {

                    if (property[i].Key == "WorkEmail") {
                        var Email = property[i].Value;
                        if (Email !== "") {
                            $("#myEmail").html("<p class='profile_email'>" + Email + "</p>");
                        }
                        email = Email;
                    }
                    if (property[i].Key == "Department") {
                        var department = property[i].Value;
                        if (department !== "") {
                            $("#myDepartment").html("<p>" + department + "</p>");
                        }
                    }
                    if (property[i].Key == "Title") {
                        var designation = property[i].Value;
                        if (designation !== "") {
                            $("#myDesignation").html("<p>" + designation + "</p>");
                        }
                    }
                    if (property[i].Key == "PreferredName") {
                        var displayName = property[i].Value;
                        if (displayName !== "") {
                            $("#myDisplayName").html("<p><a href='/_layouts/15/me.aspx' id='mydelve'>" + displayName + "</a></p>");
                        }
                    }

                    var rootsiteUrl = window.location.protocol + '//' + window.location.host;
                    var picURL = rootsiteUrl + '/_layouts/15/userphoto.aspx?size=L&accountname=' + email;

                    $("#MyProfilePic").attr("src", picURL);


                }
            },
            error: function (result) { console.log("Failed to get My property.."); }
        });


    }
    catch (e) {
        console.log(e.message);
        return '';
    }
}



