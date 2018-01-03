$(document).ready(function () {

    var docLibName = 'Documents';
    CreateFolderDocLib(docLibName);
});

function CreateFolderDocLib(docLibName) {
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Folders/add('" + docLibName + "/NewFolder')";
    $.ajax({
        url: queryUrl,
        type: 'POST',
        contentType: 'application/json;odata=verbose',
        headers: {
            'Accept': 'application/json;odata=verbose',
            'content-type': 'application/json;odata=verbose',
            'X-RequestDigest': FormDigest
        },
        success: function (data) {
            uploadDocumentssToNewlyCreatedFolder(docLibName);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
        }
    });
}

function uploadDocumentssToNewlyCreatedFolder(docLibName) {
    var elem = document.getElementById("fileToUpload");

    for (var i = 0; i < elem.files.length; ++i) {
        var fileName = elem.files[i].name;
        var file = elem.files[i];
        uploadAttachemnt(docLibName + "/NewFolder", fileName, file);
    }

}

//Code in Success callback function end.           
function getFileBuffer(file) {

    var deferred = $.Deferred();
    var reader = new FileReader();
    reader.onload = function (e) {
        deferred.resolve(e.target.result);
    }

    reader.onerror = function (e) {
        deferred.reject(e.target.error);
    }

    reader.readAsArrayBuffer(file);

    return deferred.promise();
}


function uploadAttachemnt(serverRelativeUrlToFolder, fileName, file) {
    var deferred = $.Deferred();

    getFileBuffer(file).then(

        function (buffer) {

            var bytes = new Uint8Array(buffer);

            var content = new SP.Base64EncodedByteArray();

            var fileCollectionEndpoint = String.format(
                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                "/add(overwrite=true, url='{2}')",
                _spPageContextInfo.webAbsoluteUrl, serverRelativeUrlToFolder, fileName);

            $.ajax({
                url: fileCollectionEndpoint,
                type: "POST",
                processData: false,
                contentType: "application/json;odata=verbose",
                data: buffer,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": FormDigest,
                    "content-length": buffer.byteLength
                },
                success: function (data) {
                    attachmentCount++;
                    AttachedItemUrlArray.push({
                        AttachmedItemUrl: data.d.ServerRelativeUrl,
                        AttachedFileName: data.d.Name
                    });
                    var attachedItemUrl = data.d.ServerRelativeUrl;
                    var attachedItemRequestUrl = data.d.ListItemAllFields.__deferred.uri;
                    alert('Doccument has been uploaded to New Folder');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(JSON.stringify(jqXHR));
                }
            });
        },

        function (err) {
            deferred.reject(err);
        });

    return deferred.promise();
}