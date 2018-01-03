// JavaScript source code

function UpdateAttachmentToListItem() {

	var itemID = 1;

    //Reading the Uploadef file values

    var parts = document.getElementById("fileUpload").value.split("\\");

    var filename = parts[parts.length - 1];

    var file = document.getElementById("fileUpload").files[0];

    uploadFileSP("LISTNAME", itemID, filename, file);
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
//Used to Add Attachemnt to List Item

function uploadFileSP(listName, id, fileName, file) {

    var deferred = $.Deferred();

    getFileBuffer(file).then(

  		function (buffer) {

      		var bytes = new Uint8Array(buffer);

      		var content = new SP.Base64EncodedByteArray();

      		var queryUrl = web.get_url() + "/_api/web/lists/getbytitle('" + listName + "')/items(" + id +

			 ")/AttachmentFiles/add(FileName='" + file.name + "')";

              $.ajax({

                  url: queryUrl,

                  type: "POST",

                  processData: false,

                  contentType: "application/json;odata=verbose",

                  data: buffer,

                  headers: {

                      "accept": "application/json;odata=verbose",

                      "X-RequestDigest": $("#__REQUESTDIGEST").val(),

                      "content-length": buffer.byteLength

                  }, success: function(result)
                  			{
                  				alert("Attachment Updated");
                  				window.location= web.get_url() + "/Pages/Success.aspx";                     			
                  			},

                  error: function(result){console.log("Attachment Failure:" + error.status + "," + error.statusText);}

              });

          },

            function (err) {

                deferred.reject(err);

            });

    return deferred.promise();

}