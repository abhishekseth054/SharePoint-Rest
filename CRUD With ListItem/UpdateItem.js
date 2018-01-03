// JavaScript source code

var FormDigest;
$(document).ready(function () {
    FormDigest = getFormDigest();
    var ListName = 'TestList',
    var itemID = 1;
    $('#btnUpdate').click(function () {
        UpdateItemToList(ListName, itemID);
    });
});

function UpdateItemToList(ListName, ItemID)
{
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + ListName + "')/items(" + ItemID + ")";
    stateItemID = stateItemID.toString();

    $.ajax({
        url: queryUrl,
        method: "POST",
        data: JSON.stringify
            ({
                __metadata:
                {
                    type: 'SP.Data.' + ListName + 'Item'
                },
                Age: '45'

            }),
        headers:
        {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": FormDigest,
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE"
        },
        success: function (data) {
            alert('Item Updated');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
        }
    });
}

    function getFormDigest() {
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
            method: "POST",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                FormDigest = data.d.GetContextWebInformation.FormDigestValue;
            }
        });
    }