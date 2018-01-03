// JavaScript source code

$(document).ready(function () {
    DeleteThisList("ListName");
    DeleteListItems("ListName", 2);
});

function DeleteThisList(ListName)
{
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/getbytitle('"+ListName+"')",
        method: "POST",
        headers: {
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE"
        },
        success: function (data) {
            //alert("List deleted");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
        }
    });
}

function DeleteListItems(ListName,itemID) {
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + ListName+"')/items(" + itemID + ")",
        type: "POST",
        headers:
        {
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE"
        },
        success: function (data, status, xhr) {
            alert('Item deleted');  
        },
        error: function (xhr, status, error) {
            $("#ResultDiv").empty().text(data.responseJSON.error);
        }
    });
}