// JavaScript source code

$(document).ready(function () {

    var startMonth = todayDate.getMonth() + 1;
    var day = todayDate.getDate();
    var today = startMonth + '/' + day;

    GetTodayBirthday(today);

    $(document).on("click", ".birthday_anniversary_tabs .nav-tabs>li:nth-child(2)", function () {
        GetTodayAnniversary(today);
    });
});

function GetTodayBirthday(today) {
    var birthday = 'RefinableString00';//DOB Crawled Property has been mapped with this Managed Property

    var query = 'RefinableString00:"' + today + '"';
    var profileUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext=%27" + query +
        "%27&sourceid=%27B09A7990-05EA-4AF9-81EF-EDFAB16C4E31%27&rowlimit=500" +
        "&selectproperties=%27" +
        "Title, " + birthday + ", JobTitle, Department, accountName %27";

    $.ajax({
        url: profileUrl,
        method: "GET",
        headers: {
            "accept": "application/json; odata=verbose"
        },
        success: function (data) {
            var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
            var length = results.length;

            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            var emptyResults = "<li>Today no Birthday.</li>";

            if (results.length > 0) {
                var bodyHtml = '';
                for (var i = 0; i < results.length; i++) {
                    var name = results[i].Cells.results[2].Value;
                    if (name == null)
                        name = "No Name";
                    var birthDay = new Date(Date.parse(results[i].Cells.results[3].Value));
                    if (birthDay == null)
                        birthDay = "";
                    var designation = results[i].Cells.results[4].Value;
                    if (designation == null)
                        designation = "";

                    var department = results[i].Cells.results[5].Value;

                    var accountName = results[i].Cells.results[6].Value;
                    var email = "";
                    if (accountName != undefined || accountName != null) {
                        email = accountName.split("|")[2];
                    }

                    var tenantUrl = window.location.protocol + '//' + window.location.host;
                    var picURL = tenantUrl + '/_layouts/15/userphoto.aspx?size=L&accountname=' + email;

                    bodyHtml += "<a data-toggle='modal' data-target='#myBirthday'> " +
                        "<input type='text' id='AnniName' value='" + name + "' style='display:none'>" +
                        "<input type='text' id='Annidesignation' value='" + designation + "' style='display:none'>" +
                        "<input type='text' id='Anniemail' value='" + email + "' style='display:none'>" +
                        "<input type='text' id='AnniPicUrl' value='" + picURL + "' style='display:none'>" +
                        "<input type='text' id='AnniTitle' value='Birthday' style='display:none'>" +
                        "<p><div class='profile_image_holder'><div id='divImage'>" +
                        "<img id='profilePic' src= " + picURL + " width=50px height=50px></div>" +
                        "<span class='empName'></div><div class='description_text'>" + name + "</span><br/>" +
                        "<span class='birthday_designation'>" + designation + "</p></div></a>";


                }
                $("#bdayI").append(bodyHtml);
            }
            else {
                $("#bdayI").html(bodyHtml);
            }
        },
        error: function (error) {
            console.log("Failed to get Birthday Template" + JSON.stringify(err));
        }
    });
}


function GetTodayAnniversary(today) {
    var anniversary = 'RefinableString01'; // Customattribute AnniversaryDate's Crawled Property is mapped by this Managed Property'
    var query = 'RefinableString01:"' + today + '"';
    var profileUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext=%27" +
        query + "%27&sourceid=%27B09A7990-05EA-4AF9-81EF-EDFAB16C4E31%27&rowlimit=500&selectproperties=%27Title, " +
        anniversary + ", JobTitle,  Department, accountName %27";

    $.ajax({
        url: profileUrl,
        method: "GET",
        headers: {
            "accept": "application/json; odata=verbose",
        },
        success: function (data) {
            var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
            var length = results.length;

            var emptyResults = "<li>Today no Anniversary.</li>";

            if (results.length > 0) {
                var bodyHtml = '';
                for (var i = 0; i < results.length; i++) {
                    var name = results[i].Cells.results[2].Value;
                    if (name == null)
                        name = "No Name";
                    var birthDay = new Date(Date.parse(results[i].Cells.results[3].Value));
                    if (birthDay == null)
                        birthDay = "";
                    var designation = results[i].Cells.results[4].Value;
                    if (designation == null)
                        designation = "";

                    var department = results[i].Cells.results[5].Value;

                    var accountName = results[i].Cells.results[6].Value;
                    var email = "";
                    if (accountName != undefined || accountName != null) {
                        email = accountName.split("|")[2];
                    }

                    var tenantUrl = window.location.protocol + '//' + window.location.host;
                    var picURL = tenantUrl + '/_layouts/15/userphoto.aspx?size=L&accountname=' + email;

                    bodyHtml += "<a data-toggle='modal' data-target='#myBirthday'>" +
                        "<input type='text' id='AnniName' value='" + name + "' style='display:none'>" +
                        "<input type='text' id='Annidesignation' value='" + designation + "' style='display:none'>" +
                        "<input type='text' id='Anniemail' value='" + email + "' style='display:none'>" +
                        "<input type='text' id='AnniPicUrl' value='" + picURL + "' style='display:none'>" +
                        "<input type='text' id='AnniTitle' value='Anniversary' style='display:none'>" +
                        "<p><div class='profile_image_holder'><div id='divImage'><img id='profilePic' " +
                        " src= " + picURL + " width=50px height=50px></div><span class='empName'></div> " +
                        "<div class='description_text'>" + name + "</span><br/>" +
                        "<span class='birthday_designation'>" + designation + "</p></div></a>";
                }
                $("#AnniI").html(bodyHtml);
            }
            else {
                $("#AnniI").html(emptyResults);
            }
        },
        error: function (err) {
            console.log("Fail to get Anniversary Template" + JSON.stringify(err));
        }
    });
}