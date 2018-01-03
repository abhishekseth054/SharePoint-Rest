// JavaScript source code
var listItemEntity;
$(document).ready(function () {
    listItemEntity = ListItemEntityName();
    $('#btnSave').click(function () {
        AddItemToList();
    });
});

function getFormDigest(orgurl) {
    return $.ajax({
        url: orgurl + "/_api/contextinfo",
        method: "POST",
        headers: { "Accept": "application/json; odata=verbose" }
    });
});

function AddItemToList()
{
    return getFormDigest(_spPageContextInfo.webAbsoluteUrl).then(function (data) {

        return $.ajax({
            url: web.get_url() + "/_api/lists/GetByTitle('Job Applied')/items",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify({
                '__metadata': { 'type': listItemEntity },
                'Title': $("#positionTitle").text(),
                'Email_x0020_ID': $("#EmailID").text(),
                'Mobile_x0020_No': $("#txtContactNo").val(),
                //Image URL is HyperLink
                'Image_x0020_URL':{
                                '__metadata': { 'type': 'SP.FieldUrlValue' },
                                'Description': 'Template Url',
                                'Url': $("#txtimageUrl").val()
                                }
            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": data.d.GetContextWebInformation.FormDigestValue
            },
            success: function (result) {
                var itemID = result.d.ID;
                //***********************************************************//
                //HERE WE CAN WRITE CODE FOR ATTACHMENT
                alert("Item Saved");
            },
            error: function failure() {
                alert("Fail to save");
            }
        });
    });
}

function ListItemEntityName() {
    var queryUrl = web.get_url() + "/_api/lists/getbytitle('Job Applied')?$select=ListItemEntityTypeFullName";
    $.ajax({
        url: queryUrl,
        method: "GET",
        headers: { "Accept": "application/json;odata=verbose" },
        success: function GetEntityNameSuccess(data) {
            listItemEntity = data.d.ListItemEntityTypeFullName;
        },
        error: function GetEntityNameFailure()
        {
            alert("Fail to get List Item entity");
        }
    });
}