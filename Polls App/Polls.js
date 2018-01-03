// JavaScript source code

$(document).ready(function () {
    GetActivePollQuestion();

    $(document).on('click', '#btnPollSubmit', function (event) {

        //event.preventDefault();
        var PollQuestion = $('#PollQuestion').text();
        var QuestionID = $('#PollQuestionID').text();

        var response = $("input[name= PollOptions]:checked").val();
        //alert(response);
        if (response == null || response == "" || response == undefined) {
            $(".poll_response").html("<span class='warning'>Please Select Option</span>");
            //alert("Please Select Option");
            return false;
        }
        AddPollResponseToList(PollQuestion, response, QuestionID);
    });
});


function AddPollResponseToList(PollQuestion, response, QuestionID) {
    try {
        var context = new SP.ClientContext.get_current();
        var list = context.get_web().get_lists().getByTitle('Poll Response');
        var itemCreateInfo = new SP.ListItemCreationInformation();
        this.listItem = list.addItem(itemCreateInfo);
        listItem.set_item('Title', PollQuestion);
        listItem.set_item('Response', response);
        listItem.set_item('Poll_x0020_Question_x0020_ID', QuestionID);
        listItem.update();
        context.load(listItem);
        context.executeQueryAsync(Function.createDelegate(this, this.onPollSubmitted), Function.createDelegate(this, this.onPollinFailed));

    }
    catch (error) {
        console.log("Exception occur while submitting the Poll");
        return false;
    }
}

function onPollSubmitted(e) {
    /*$(".poll_response").html("<span class='success'>Poll has been submitted<span>");*/
    alert("Poll has been submitted");
    //$('#PollQuestionForm').css('display','none');
    //$('#PollResponseChart').css('display','block');
    //e.preventDefult();
    return false;
}

function onPollinFailed() {
    console.log("Fail to Sumbit the Poll");
}

function GetActivePollQuestion() {
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Poll Question')/Items?" +
        "$filter=Poll_x0020_Status_x0020__x002d__ eq 1&$orderby=ID desc&$top=1";
    $.ajax({
        url: queryUrl,
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var property = data.d.results;
            $.each(property, function (key, value) {

                var question = value.Title;
                var questionID = value.ID;
                var optionA = value.Option_x0020_A;
                var optionB = value.Option_x0020_B;
                var optionC = value.Option_x0020_C;
                var optionD = value.Option_x0020_D;
                var optionE = value.Option_x0020_E;
                var optionF = value.Option_x0020_F;

                var bodyHtml = GetHTMLForActiveQuestion(question, questionID, optionA, optionB, optionC, optionD, optionE, optionF);
                $('#PollQuestionForm').html(bodyHtml);

                CheckIfCurrentUserHasSubmitThisPoll(question, questionID, optionA, optionB, optionC, optionD, optionE, optionF);

            });
        },
        error: function (err) {
            console.log("error while getting the Poll Question");
        }
    });
}


function CheckIfCurrentUserHasSubmitThisPoll(question, QuestionID, optionA, optionB, optionC, optionD, optionE, optionF) {
    var currentUserID = _spPageContextInfo.userId;
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Poll Response')/Items?" +
        "$filter=Author eq " + currentUserID + " and Poll_x0020_Question_x0020_ID eq " + QuestionID;

    $.ajax({
        url: queryUrl,
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var property = data.d.results;
            //console.log(property);
            if (property.length > 0) {
                $('#PollQuestionForm').css('display', 'none');
                $('#PollResponseChart').css('display', 'block');
                GetAllResponseForThisQuestionAndDisplayChart(question, QuestionID, optionA, optionB, optionC, optionD, optionE, optionF);
            }
            else {
                var bodyHtml = GetHTMLForActiveQuestion(question, QuestionID, optionA, optionB, optionC, optionD, optionE, optionF);
                $('#PollQuestionForm').html(bodyHtml);
                $('#PollQuestionForm').css('display', 'block');
                $('#PollResponseChart').css('display', 'none');
            }
        },

        error: function (err) {
            console.log("error while getting the Current User Active Poll Response");
        }
    });
}

function GetHTMLForActiveQuestion(question, QuestionID, optionA, optionB, optionC, optionD, optionE, optionF) {
    var bodyHtml = "<div>" +
        "<p id='PollQuestion'>" + question + "</p>" +
        "<p id='PollQuestionID' style='display:none'>" + QuestionID + "</p>" +
        "<p class='polloption'><input type='radio' id='optiona' name='PollOptions' value='" + optionA + "'> <label for='optiona'>" + optionA + "</label></p>" +
        "<p class='polloption'><input type='radio' id='optionb' name='PollOptions' value='" + optionB + "'> <label for='optionb'>" + optionB + "</label></p>";
    if (optionC) {
        bodyHtml += "<p class='polloption'><input type='radio' id='optionc' name='PollOptions' value='" + optionC + "'> <label for='optionc'>" + optionC + "</label></p>";
    }
    if (optionD) {
        bodyHtml += "<p class='polloption'><input type='radio' id='optiond' name='PollOptions' value='" + optionD + "'> <label for='optiond'>" + optionD + "</label></p>";
    }

    if (optionE) {
        bodyHtml += "<p class='polloption'><input type='radio' id='optione' name='PollOptions' value='" + optionE + "'> <label for='optione'>" + optionE + "</label></p>";
    }
    if (optionF) {
        bodyHtml += "<p class='polloption'><input type='radio' id='optionf' name='PollOptions' value='" + optionF + "'> <label for='optionf'>" + optionF + "</label></p>";
    }

    bodyHtml += "<button id='btnPollSubmit'>Vote</button><div class='poll_response'></div></div>";


    return bodyHtml;
}


function GetAllResponseForThisQuestionAndDisplayChart(Question, QuestionID, optionA, optionB, optionC, optionD, optionE, optionF) {
    var chartData = [];

    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Poll Response')/Items?" +
        "$filter=Poll_x0020_Question_x0020_ID eq " + QuestionID + "&$top=6000";

    $.ajax({
        url: queryUrl,
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var property = data.d.results;
            var optionACount = 0;
            var optionBCount = 0;
            var optionCCount = 0;
            var optionDCount = 0;
            var optionECount = 0;
            var optionFCount = 0;

            $.each(property, function (key, value) {
                if (value.Response == optionA) {
                    optionACount++;
                }
                if (value.Response == optionB) {
                    optionBCount++;
                }
                if (value.Response == optionC) {
                    optionCCount++;
                }
                if (value.Response == optionD) {
                    optionDCount++;
                }
                if (value.Response == optionE) {
                    optionECount++;
                }
                if (value.Response == optionF) {
                    optionFCount++;
                }
            });

            var heading = [];
            heading.push('Question', 'Count');
            var optionARes = [];
            optionARes.push(optionA, optionACount);
            var optionBRes = [];
            optionBRes.push(optionB, optionBCount);
            var optionCRes = [];
            optionCRes.push(optionC, optionCCount);
            var optionDRes = [];
            optionDRes.push(optionD, optionDCount);
            var optionERes = [];
            optionERes.push(optionE, optionECount);
            var optionFRes = [];
            optionFRes.push(optionF, optionFCount);

            chartData.push(heading);
            chartData.push(optionARes);
            chartData.push(optionBRes);
            chartData.push(optionCRes);
            chartData.push(optionDRes);
            chartData.push(optionERes);
            chartData.push(optionFRes);

            //console.log(chartData);
            RenderPieChart(Question, chartData)


        },
        error: function (err) {
            console.log("error while getting the Active Poll All Response");
        }
    });
}

function RenderPieChart(Question, chartData) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable(chartData);

        var options = {
            legend: 'none',
            pieSliceText: 'label',
            title: Question,
            //sliceVisibilityThreshold: .2
            //is3D: true,
            //pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('PollResponseChart'));

        chart.draw(data, options);
    }
}


