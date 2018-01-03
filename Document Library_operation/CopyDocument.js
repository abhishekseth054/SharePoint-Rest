var FormDigest;
var docName;
var doctype;
var errorMessage = "Sorry! Something went wrong! Please try after sometime.";
var _ctx;
var _sourceFile;


$(document).ready(function () {
    GetFormDigest();
    var docId = GetParameterValues(DOCID);
    CopyDocumentToSelectedStateLibrary(docId);
});

function CopyFile(docId, success, error) {
    _ctx = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

    // Get the Web site that is associated with the client context.
    this.web = _ctx.get_web();
    _ctx.load(this.web);

    // Returns the list with the specified title from the collection.
    this.sourceList = this.web.get_lists().getByTitle('Source Library');
    _ctx.load(this.sourceList);

    // Get the list items being selected.

    this.currentItem = sourceList.getItemById(docId);
    _ctx.load(this.currentItem);

    // Get the file that is represented by the item from a document library.
    _sourceFile = this.currentItem.get_file();
    _ctx.load(_sourceFile);

    _ctx.executeQueryAsync(function () {
        success(_sourceFile);
    },
        error
    );
}

function CopyDocumentToSelectedStateLibrary(docId) {
    CopyFile(docId,
        function (_sourceFile) {
            if (_sourceFile != null) {
                var _destinationlibUrl = web.get_serverRelativeUrl() + '/' + DESTINATIONDOCSLIBRARYNAME + '/' + _sourceFile.get_name();
                _sourceFile.copyTo(_destinationlibUrl, 1);

                _ctx.executeQueryAsync(
                    function (sender, args) {
                        var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/GetFileByServerRelativeUrl('" + _spPageContextInfo.webServerRelativeUrl + "/" + DESTINATIONDOCSLIBRARYNAME + "/" + _sourceFile.get_name() + "')/ListItemAllFields";
                        GetCopiedDocumentIdFromStateLibrary(queryUrl, docId, DESTINATIONDOCSLIBRARYNAME);
                    },
                    function (jqXHR, textStatus, errorThrown) {
                        console.log(JSON.stringify(jqXHR));
                    }
                );
            }
        },
        function (jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
        }
    );
}

function GetCopiedDocumentIdFromDESTINATIONDOCSLIBRARYNAME(queryUrl, docId, DESTINATIONDOCSLIBRARYNAME) {
    $.ajax({
        url: queryUrl,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            alert('Success');
        },
        error: function (data) {
            $('#divLoading').css("display", "none");
        }
    });
}

function GetFormDigest() {
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
        type: "POST",
        headers: {
            "accept": "application/json;odata=verbose",
            "contentType": "text/xml"
        },
        success: function (data) {
            var requestdigest = data;
            var formDigest = data.d.GetContextWebInformation.FormDigestValue;
            FormDigest = formDigest;;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
        }
    });
}

function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}