// JavaScript source code


$(document).ready(function () {
    var today = new Date();
    var dateFilter = today.toISOString();

    //List is having Expiry Date, Published Date, RollUpImage, Catogry Column(LookUp) 
    //and SP2010 Approval Workflow status
    GetListItem(dateFilter);

});

function GetListItem(dateFilter) {
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('ListName')/items?" +
        "$select=ID,Title,PostCategory/Title&$expand=PostCategory/ID" +
        "&$filter=(Expiry_x0020_Date ge datetime'" + dateFilter + "')and(PublishedDate le datetime'" + dateFilter + "')and" +
        "(Approval eq 16)&$orderby=ID desc&$top=6";
    //console.log(queryUrl);
    $.ajax({
        url: queryUrl,
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var property = data.d.results;
            //console.log(property);
            var count = 0;
            $.each(property, function (key, value) {
                var Id = value.ID;
                var Title = value.Title;
                var Category = value.PostCategory.results;

                if (Category.length > 0) {
                    Category = value.PostCategory.results[0].Title;
                }

                GetPublishingImageBind(Id, Title, Category, count);
                count++;
            });

        },
        error: function (result) {
            console.log("Failed to get News");
        }
    });

}

function GetPublishingImageBind(ID, title, Category, count) {
    var dfd = $.Deferred();
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('ListName')/items(" + ID + ")/FieldValuesAsHtml";
    $.ajax({
        url: queryUrl,
        method: 'GET',
        headers: { Accept: 'application/json; odata=verbose' },

        success: function (data, request) {
            var imageUrl = data.d.Rollup_x005f_x0020_x005f_Image.split(' ')[2].split('"')[1];
            if (count == 0) {
                $("#img1").attr("src", imageUrl);
                if (Category != "")
                    $("#catagory_first").html("<label class='tag'>" + Category + "</label>");
                $("label[for='label_first']").html(title);
                $("#link1").attr("href", _spPageContextInfo.webAbsoluteUrl + "/Lists/Posts/Post.aspx?ID=" + newsID);
            }
            else if (count == 1) {
                $("#img2").attr("src", imageUrl);
                if (Category != "")
                    $("#catagory_second").html("<label class='tag'>" + Category + "</label>");
                $("label[for='label_second']").html(title);
                $("#link2").attr("href", _spPageContextInfo.webAbsoluteUrl + "/Lists/Posts/Post.aspx?ID=" + newsID);
            }
            else if (count == 2) {
                $("#img3").attr("src", imageUrl);
                if (Category != "")
                    $("#catagory_third").html("<label class='tag'>" + Category + "</label>");
                $("label[for='label_third']").html(title);
                $("#link3").attr("href", _spPageContextInfo.webAbsoluteUrl + "/Lists/Posts/Post.aspx?ID=" + newsID);
            }
            else if (count == 3) {
                $("#img4").attr("src", imageUrl);
                if (Category != "")
                    $("#catagory_fourth").html("<label class='tag'>" + Category + "</label>");
                $("label[for='label_fourth']").html(title);
                $("#link4").attr("href", _spPageContextInfo.webAbsoluteUrl + "/Lists/Posts/Post.aspx?ID=" + newsID);
            }
            else if (count == 4) {
                $("#img5").attr("src", imageUrl);
                if (Category != "")
                    $("#catagory_fifth").html("<label class='tag'>" + Category + "</label>");
                $("label[for='label_fifth']").html(title);
                $("#link5").attr("href", _spPageContextInfo.webAbsoluteUrl + "/Lists/Posts/Post.aspx?ID=" + newsID);
            }
            else if (count == 5) {
                $("#img6").attr("src", imageUrl);
                if (Category != "")
                    $("#catagory_sixth").html("<label class='tag'>" + Category + "</label>");
                $("label[for='label_sixth']").html(title);
                $("#link6").attr("href", _spPageContextInfo.webAbsoluteUrl + "/Lists/Posts/Post.aspx?ID=" + newsID);
            }
            dfd.resolve();
        }
    });
    return dfd.promise();
}
