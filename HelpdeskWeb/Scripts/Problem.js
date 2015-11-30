﻿$(function () {
    getProblems();

    $("#problemNames").click(function (e) {
        if (!e) e = window.event;
        var prbId = e.target.parentNode.id;

        if (prbId == "main") {
            prbId = e.target.id; // Clicked on row somewhere else
        }

        if (prbId != "problem") {
            getById(prbId); // Existing Problem
            $("#ButtonAction").prop("value", "Update");
            $("#ButtonDelete").show();
        } else { // New Problem
            $("#ButtonDelete").hide();
            $("#ButtonAction").prop("value", "Add");
            $("#HiddenId").val("");
            $("#descriptionTextbox").val("");
            $("#ButtonUpdate").prop("value", "Add");
            $("#ButtonDelete").hide();
        }
    });

    $("#ButtonDelete").click(function () {
        var deletePrb= confirm("Really delete this problem?");
        if (deletePrb) {
            $.ajax({
                type: "Delete",
                url: "api/problem/" + $("#HiddenId").val(),
                contentType: "application/json; charset=utf-8"
            }).done(function (data) {
                Message(data, "defaultMsg");
                getProblems();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in delete Problem.", "errorMsg");
                $("#employeeModal").modal("hide");
            });
            return !deletePrb;
        } else
            return !deletePrb;
    });

    $("#ButtonAction").click(function () {
        if ($("#ButtonAction").val() === "Update") {
            // Update
            prb = new Object();
            prb.Id = $("#HiddenId").val();
            prb.Entity64 = $("#HiddenEntity").val();
            prb.Description = $("#descriptionTextbox").val();

            $.ajax({
                type: "Put",
                url: "api/problem",
                data: JSON.stringify(prb),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true
            }).done(function (data) {
                Message(data, "defaultMsg");
                getProblems();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in update Problem.", "errorMsg");
            });
        } else {
            // Create
            prb = new Object();
            prb.Description = $("#descriptionTextbox").val();

            $.ajax({
                type: "Post",
                url: "api/problem",
                data: JSON.stringify(prb),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true
            }).done(function (data) {
                Message(data, "defaultMsg");
                getProblems();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in create Problem.", "errorMsg");
            });
        }

        return false;
    });
});

function buildTable(data) {
    $("#problemNames").empty();
    var bg = false;
    problems = data;
    div = $("<div id=\"problem\" data-toggle=\"modal\" data-target=\"#problemModal\" class=\"row trWhite\">");
    div.html("<div class=\"col-lg-12\" id=\"id0\">...Click here to add</div>");
    div.appendTo($("#problemNames"));
    $.each(data, function (index, prb) {
        var cls = "rowWhite";
        bg ? cls = "rowWhite" : cls = "rowLightGrey";
        bg = !bg;
        div = $("<div id=\"" + prb.Id + "\" data-toggle=\"modal\" data-target=\"#problemModal\" class=\"row col-lg-12 " + cls + "\">");
        var prbId = prb.Id;
        div.html("<div class=\"col-xs-12\" id=\"problemDescription" + prbId + "\">" + prb.Description + "</div>");
        div.appendTo($("#problemNames"));
    });
}

function getProblems() {
    return $.ajax({ // Return the promise that $.ajax returns (deferred object)
        type: "Get",
        url: "api/problems",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        buildTable(data);
        Message("Problems Retrivied", "successMsg");
        $("#problemModal").modal('hide');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting all Problems.", "errorMsg");
    });
}

function getById(id) {
    var data = $.ajax({
        type: "Get",
        url: "api/problem/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        $("#HiddenId").val(data.Id);
        $("#HiddenEntity").val(data.Entity64);
        $("#descriptionTextbox").val(data.Description);
        Message("Problem " + data.Description + " retrieved", "successMsg");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Problem.", "errorMsg");
    });
}