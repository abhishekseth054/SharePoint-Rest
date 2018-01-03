var isGroupA = false;

$(document).ready(function () {
    checkIfCurrentUserIsMemberOf("GroupNameA");
});

function checkIfCurrentUserIsMemberOf(SPgroupName) {
    var requestUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getByName('" + SPgroupName + "')/Users?$filter=Id eq " + _spPageContextInfo.userId;

    $.ajax({
        url: requestUrl,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            //console.log(data);
            if (data.d.results[0] != undefined) {
                if (SPgroupName == "GroupNameA")
                { isGroupA = true; }
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error) );
        }
    });
}