var FormDigest;
var errorMessage = 'Something went wrong! Please try after sometime.';
$(document).ready(function () {
	$('#divLoading').css('display','none');
	GetDocType();
	getFormDigest();
	var docLibName = 'Finance Docs';
	
	$("#ddlDocType").change(function() {
		var docType = $('#ddlDocType').val();
		if(docType == '-1'){
			$('#helpText').html('Please select the document type.');
          	$('#helpText').css('display','block');
			$('#divLoading').css("display", "none");
			return false;
		}
		else{
			$('#helpText').css('display','none');
			$('#divLoading').css("display", "none");
			return false;
		}
	});
	
	document.getElementById('docsToUpload').onchange = function() {
      	$('#helpTextUpload').css('display','none');
		$('#helpTextCommon').css('display','none');
		var IsFileName = $('#docsToUpload').val();
		
		if(IsFileName){
			$('#divLoading').css("display", "block");
			var parts = document.getElementById("docsToUpload");
		    var fileName = parts.files[0].name;
		    var file = parts.files[0];
		    CheckIfSameDocumentNameIsAvailable(docLibName,fileName,file,'');
		}
		else{
			$('#helpTextCommon').html('');
  			$('#helpTextCommon').css('display','none');
  			$('#helpTextCommon').css('margin-left','0%');
  			$('#divLoading').css("display", "none");
		}
	};
	
	$('#btnSave').click(function(){
	
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			$('#helpTextCommon').html('The File APIs are not fully supported in this browser.');
			$('#helpTextCommon').css('display','block');
      		return false;
    	}    	
    	
    	var fileName = $('#docsToUpload').val();
    	var docType = $('#ddlDocType').val();
    	
    	if(!fileName && docType == '-1')
    	{
    		$('#helpTextUpload').html('Please upload the document.');
          	$('#helpTextUpload').css('display','block');
          	$('#helpText').html('Please select the document type.');
          	$('#helpText').css('display','block');
			$('#divLoading').css("display", "none");

    	}
    	if(!fileName){
	        $('#helpTextUpload').html('Please upload the document.');
          	$('#helpTextUpload').css('display','block');
			$('#divLoading').css("display", "none");
			return false;
	    }
		
		
		if(docType == '-1'){
			$('#helpText').html('Please select the document type.');
          	$('#helpText').css('display','block');
			$('#divLoading').css("display", "none");
			return false;
		}
		
		if(fileName && docType != '-1'){
			var docType = $('#ddlDocType option:selected').text();
			$('#divLoading').css("display", "block");
			
			if (!window.FileReader) {
				$('#helpTextCommon').html('The File APIs are not fully supported in this browser.');
				$('#helpTextCommon').css('display','block');
      			return false;
		    }
		    
		    var parts = document.getElementById("docsToUpload");
		    var fileName = parts.files[0].name;
		    var file = parts.files[0];
		    CheckIfSameDocumentNameIsAvailable(docLibName,fileName,file,docType);
		}
	});
	
	$('#btnCancel').click(function(){
		$('.errorMsg').css('display', 'none');
		$('#ddlDocType').val('-1');
		$('#btnSave').prop( "disabled", false);
		document.getElementById('docsToUpload').parentNode.innerHTML = document.getElementById('docsToUpload').parentNode.innerHTML;
		$('#divLoading').css("display", "none");
		//location.reload();
	});
});


function CheckIfSameDocumentNameIsAvailable(docLibName,fileName, file, docType)
{
    //var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+ docLibName +"')/items?$filter=FileLeafRef eq '" + fileName +"'";

    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+ docLibName +"')/items?$select=FileLeafRef,State_Approval_Count" +
					"&$filter=FileLeafRef eq '" + fileName +"'";
					
    $.ajax({
        url: queryUrl,
        method: "GET",
        contentType: 'application/json;odata=verbose',
          headers: { 
                 'Accept': 'application/json;odata=verbose',
                 'content-type':'application/json;odata=verbose'
          },
        success: function (data){
         	var results = data.d.results; 
         	if(results.length == 1){
         		var approvalCount = results[0].State_Approval_Count;
         		if(approvalCount == 0)	{
         			if(docType != ''){
	         			var exist = confirm("A document is available with same name, Do you want to Overwrite it?");
	         			if(exist){
	         				UploadDocumentToDocLib(docLibName, fileName, file, docType);
	         			}
	         			else{
		         			$('#helpTextUpload').html('Please choose a document with different name.');
		          			$('#helpTextUpload').css('display','block');
				        	$('#divLoading').css("display", "none");
	         			}
	         		}
	         		else{
		         		$('#helpText').html('');
		         		$('#helpText').css('display','none');
			        	$('#divLoading').css("display", "none");
			        	$('#btnSave').prop( "disabled", false);
	         		}
         		}
         		else if(approvalCount > 0){
         			$('#helpTextCommon').html('You can not upload this document because a document with the same name is already available and Approval process has been started.');
          			$('#helpTextCommon').css('display','block');
          			$('#helpTextCommon').css('margin-left','0%');
					$('#divLoading').css("display", "none");
					$('#btnSave').prop( "disabled", true);
         		}
         		else{
         			$('#helpTextCommon').html('');
	         		$('#helpTextCommon').css('display','none');
					$('#divLoading').css("display", "none");
					$('#btnSave').prop( "disabled", false);
         		}
         	} 
         	else{
         		$('#helpTextCommon').html('');
	         	$('#helpTextCommon').css('display','none');
	         	$('#divLoading').css("display", "none");
	         	$('#btnSave').prop( "disabled", false);
	         	
         		if(docType != ''){
         			$('#divLoading').css("display", "block");
         			UploadDocumentToDocLib(docLibName, fileName, file, docType);
         		}
         	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
          			$('#helpText').html(errorMessage);
          			$('#helpText').css('display','block');
		        	$('#divLoading').css("display", "none");
		            console.log(JSON.stringify(jqXHR));
        	}
        });
}

function UploadDocumentToDocLib(docLibName, fileName, file, docType)
{
	var deferred = $.Deferred();

    getFileBuffer(file).then(

  		function (buffer) {
      		var bytes = new Uint8Array(buffer);

      		var content = new SP.Base64EncodedByteArray();

			var fileCollectionEndpoint = String.format(
							                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
							                "/add(overwrite=true, url='{2}')",
							                _spPageContextInfo.webAbsoluteUrl, docLibName, fileName);
      		
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
                  success: function(data){
              				 var documentItemRequestUrl = data.d.ListItemAllFields.__deferred.uri;
              				 //console.log(documentItemRequestUrl);
              				 GetThisDocumentItemIDForUpdateMetaData(docLibName, documentItemRequestUrl, docType, fileName);                     			
              			 },

                  error: function(error){
              				alert(errorMessage);	
				        	$('#divLoading').css("display", "none");
				            console.log(JSON.stringify(error));
                  		}
              });
          },

        function (err) {
            deferred.reject(err);
        });

    return deferred.promise();
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

function GetThisDocumentItemIDForUpdateMetaData(docLibName, documentItemRequestUrl, docType, fileName)
{
	$.ajax({
        url: documentItemRequestUrl,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
			        var documentItemID = data.d.Id;
			        //alert(documentItemID);
			        UpdateThisDocumentMetaData(documentItemID, docLibName, docType, fileName);
        },
        error: function (jqXHR, textStatus, errorThrown) {
		            $('#helpTextCommon').html(errorMessage);
		  			$('#helpTextCommon').css('display','block');
		        	$('#divLoading').css("display", "none");
		            console.log(JSON.stringify(jqXHR));
        }
    });
}

function UpdateThisDocumentMetaData(documentItemID, docLibName, docType, fileName)
{
	var queryUrl = _spPageContextInfo.webAbsoluteUrl+ "/_api/web/lists/getbytitle('" + docLibName + "')/items(" + documentItemID + ")";
	console.log(queryUrl);
    var approlvalPageURL = _spPageContextInfo.webAbsoluteUrl + "/SitePages/Review%20Page.aspx?DocID=" + documentItemID;
    var approlvalPageURLHTML = "<div><a href="+approlvalPageURL+">Click here to Review/Approve</a></div>";
    
    $.ajax({
        url: queryUrl,
        method: "POST",
        data: JSON.stringify  
        ({  
            __metadata:  
            {  
                type: 'SP.Data.Finance_x0020_DocsItem' 
            }, 
    		Approval_x0020_URL: approlvalPageURLHTML,
    		Document_x0020_Type:docType,
    		State_Approval_Count:0
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
        			AddListItem(documentItemID, docType, fileName);        						
			    },
        error: function (jqXHR, textStatus, errorThrown) {
		            $('#helpTextCommon').html(errorMessage);
		  			$('#helpTextCommon').css('display','block');
		        	$('#divLoading').css("display", "none");
		            console.log(JSON.stringify(jqXHR));
    		}
    });
}

function AddListItem(documentItemID,docType, fileName)  
{ 
  	var docID = documentItemID.toString();
    var queryUrl = _spPageContextInfo.webAbsoluteUrl+ "/_api/web/lists/getbytitle('LogHistory')/items";
	    
    $.ajax({
        url: queryUrl,
        method: "POST",
        data: JSON.stringify  
        ({  
            __metadata:  
            {  
                type: 'SP.Data.TSDNLogHistoryListItem' 
            },
			Document_x0020_Parent_x0020_ID: docID,    		 		
    		Title: fileName,
    		Document_x0020_Type: docType
        }),
        headers: 
        { 
        	"Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": FormDigest,              
        },
        success: function(data)  {       
        	 alert("Document has been uploaded along with the Metadata.");
        	 $(location).attr('href','../../Documents/Forms/AllItems.aspx');
        	 $('#divLoading').css("display", "none");             
        },  
        error: function(jqXHR, textStatus, errorThrown) {  
            $('#helpText').html(errorMessage);
  			$('#helpText').css('display','block');
        	$('#divLoading').css("display", "none");
            console.log(JSON.stringify(jqXHR));
        }  
    });  
}

function getFormDigest() {
    $.ajax({
        url:  _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
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
        error: function (err) {
            $('#helpTextCommon').html(errorMessage);
  			$('#helpTextCommon').css('display','block');
        	$('#divLoading').css("display", "none");
        	$('#btnSave').prop( "disabled", true);
            console.log(JSON.stringify(jqXHR));
        }
    });
}


function GetDocType()
{
	var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/GetbyTitle('Docs Type')/items?$select=Title&$orderby=Title";
	var bodyHtml = "<option value='-1'>SELECT</option>";
	$.ajax({
          url: queryUrl,
          type: 'Get',
          contentType: 'application/json;odata=verbose',
          headers: { 
                 'Accept': 'application/json;odata=verbose',
                 'content-type':'application/json;odata=verbose'
          },
          success: function (data) {
                    //console.log(data);
                    var results = data.d.results;
                    $.each(results, function(key, item){
                    	bodyHtml += "<option value="+ key + ">"+ item.Title +"</option>";
                    });
                    $('#ddlDocType').html(bodyHtml);
		          },
          error: function (jqXHR, textStatus, errorThrown) {
          			$('#helpText').html(errorMessage);
          			$('#helpText').css('display','block');
		        	$('#divLoading').css("display", "none");
		        	$('#btnSave').prop( "disabled", true);
		            console.log(JSON.stringify(jqXHR));
          }
	});
}
