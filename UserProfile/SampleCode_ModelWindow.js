// JavaScript source code

var listItemEntity;
$(document).ready(function () {

    var title;
    $(document).on("click", "#AnniI a, #bdayI a", function () {
        var name = $(this).find("input#AnniName").val();
        $('#empName').html(name);
        var email = $(this).find("input#Anniemail").val();
        $('#EmailID').html(email);

        var designation = $(this).find("input#Annidesignation").val();
        $('#department').html(designation);

        var picURl = $(this).find("input#AnniPicUrl").val();
        $("#profilePicPop").attr("src", picURl);

        title = $(this).find("input#AnniTitle").val();
        GetBirthdayWishesListItemEntityTypeFullName();
    });

    $("#btnSubmit").click(function () {

        var tenantUrl = window.location.protocol + '//' + window.location.host;
        var selectedImage = $(".selectedImage").attr("src");
        var name = $("#empName").text();
        var message = $("#txtMessage").val();
        var Email = $("#EmailID").text();
        var imgURL = tenantUrl + selectedImage;

        if (message == "") {
            $("#Birthday-send-msg").html("Please enter message");
            return false;
        }

        if (selectedImage == null) {
            $("#Birthday-send-msg").html("Please select greeting image");
            return false;
        }

        AddItemToList(listItemEntity, name, message, Email, imgURL, title);
        
    });
});

function AddItemToList(r, name, message, Email, imgURL, title) {
    try {
        var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/GetByTitle('Birthday Wishes')/items";

        $.ajax({
            url: queryUrl,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify({
                '__metadata': { 'type': r },
                'Title': title,
                'Name': name,
                'Message': message,
                'Email': Email,
                'Template': imgURL,
				/*'Imaged_x0020_URL': 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': 'Template Url',
                    'Url': imgURL                
                },*/

            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: onQuerySucess,
            error: onQueryFailure
        });
    }
    catch (ex) {
        console.log("Exception" + ex.message);
    }
}

function onQuerySucess() {
    $("#txtMessage").val("");
    $("img").removeClass("selectedImage");
    $('.cover').removeClass("selectedimg");
    $("#Birthday-send-msg").html("");
    alert('Your wishes sent successfull to ' + $("#empName").text());
}

function onQueryFailure(error) {
    console.log(JSON.stringify(error));
}

function GetBirthdayWishesListItemEntityTypeFullName() {
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('Birthday Wishes')?$select=ListItemEntityTypeFullName";
    $.ajax({
        url: queryUrl,
        method: "GET",
        headers: { "Accept": "application/json;odata=verbose" },
        success: onEntitySuccess,
        error: onEntityFailure
    });
}

function onEntitySuccess(data) {
    listItemEntity = data.d.ListItemEntityTypeFullName;
}
function onEntityFailure(err) {
    console.log(err.statusText);
}
















