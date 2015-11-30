$(function () {
    $.validator.addMethod("notDefault", function (value, element) { // custom rule
        return this.optional(element) || (value != "notValid");
    }, "");

    getCalls();

    $("#calls").click(function (e) {
        var validator = $('#CallForm').validate();
        validator.resetForm();

        // Enable everything...
        $("#ddlProblems").prop("disabled", false);
        $("#ddlEmployees").prop("disabled", false);
        $("#ddlTechs").prop("disabled", false);
        $("#CloseCallCheck").prop("disabled", false);
        $("#NotesTextArea").prop("readonly", false);
        $("#ButtonAction").show();

        if (!e) e = window.event;
        var callId = e.target.parentNode.id;

        if (callId == "main") {
            callId = e.target.id; // Clicked on row somewhere else
        }

        $("#ButtonAction").prop("disabled", true);

        if (callId != "call") {
            Message("Loading...", "defaultMsg");
            getById(callId); // Existing call

            Message("Call found!", "successMsg");
            $("#ButtonAction").prop("disabled", false);

            $("#ButtonAction").prop("value", "Update");
            $("#ButtonDelete").show();
        } else { // New call
            $("#ButtonDelete").hide();
            $("#ButtonAction").prop("value", "Add");
            $("#ButtonAction").prop("disabled", false);
            $("#CloseCallCheck").prop("disabled", true);

            loadProblemsDDL(-1);
            loadEmployeeDDL(-1);
            loadTechDDL(-1);

            $("#DateOpenedLabel").text(formatDate());
            $("#HiddenDateOpened").val(formatDate());
            $("#DateClosedLabel").text("Can't Close During Add.");
            $("#HiddenDateClosed").val(formatDate());
            $("#CloseCallCheck").prop("checked", false);
            $("#NotesTextArea").val("");

            $("#ButtonUpdate").prop("value", "Add");
            $("#ButtonDelete").hide
        }
    });

    $("#ButtonDelete").click(function () {
        var deleteCall = confirm("Really delete this call?");
        if (deleteCall) {
            $.ajax({
                type: "Delete",
                url: "api/call/" + $("#HiddenId").val(),
                contentType: "application/json; charset=utf-8"
            }).done(function (data) {
                Message(data, "defaultMsg");
                getCalls();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in delete Call.", "errorMsg");
                $("#callModal").modal("hide");
            });
            return !deleteCall; // false!!
        } else
            return !deleteCall;
    });

    $("#ButtonAction").click(function () {
        if ($("#CallForm").valid()) {
            Message("Data Validated by jQuery!", "successMsg");
            doUpdate();
        }
        else {
            Message("Please correct errors.", "errorMsg");
        }
        return false;
    });

    $("#CloseCallCheck").click(function () {
        if ($("#CloseCallCheck").is(":checked")) {
            $("#DateClosedLabel").text(formatDate());
            $("#HiddenDateClosed").val(formatDate());
        } else {
            $("#DateClosedLabel").text("Not Closed.");
            $("#HiddenDateClosed").val("");
        }
    });
});

function doUpdate() {
    call = new Object();
    call.Id = $("#HiddenId").val();
    call.ProblemId = $("#ddlProblems").val();
    call.EmployeeId = $("#ddlEmployees").val();
    call.TechId = $("#ddlTechs").val();
    call.DateOpened = $("#HiddenDateOpened").val();
    if ($("#CloseCallCheck").is(':checked')) {
        call.DateClosed = $("#HiddenDateClosed").val();
    }
    call.OpenStatus = !$("#CloseCallCheck").is(':checked');
    call.Notes = $("#NotesTextArea").val();
    call.Entity64 = $("#HiddenEntity").val();

    if ($("#ButtonAction").val() === "Update") {
        // Update
        $.ajax({
            type: "Put",
            url: "api/call",
            data: JSON.stringify(call),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true
        }).done(function (data) {
            Message(data, "defaultMsg");
            getCalls();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Message("Error in update Call.", "errorMsg");
        });
    } else {
        // Create
        $.ajax({
            type: "Post",
            url: "api/call",
            data: JSON.stringify(call),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true
        }).done(function (data) {
            Message(data, "defaultMsg");
            getCalls();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Message("Error in create Call.", "errorMsg");
        });
    }
}

function buildTable(data) {
    $("#calls").empty();
    var bg = false;
    problems = data;
    div = $("<div id=\"call\" data-toggle=\"modal\" data-target=\"#callModal\" class=\"row trWhite\">");
    div.html("<div class=\"col-lg-12\" id=\"id0\">...Click here to add</div>");
    div.appendTo($("#calls"));
    $.each(data, function (index, call) {
        var cls = "rowWhite";
        bg ? cls = "rowWhite" : cls = "rowLightGrey";
        bg = !bg;
        div = $("<div id=\"" + call.Id + "\" data-toggle=\"modal\" data-target=\"#callModal\" class=\"row col-lg-12 " + cls + "\">");
        div.html("<div class=\"col-xs-4\" id=\"callDateOpened" + call.Id + "\">" + formatDate(call.DateOpened) + "</div>"
            + "<div class=\"col-xs-4\" id=\"callDisplayName" + call.Id + "\">" + call.DisplayName + "</div>"
            + "<div class=\"col-xs-4\" id=\"callDisplayProblem" + call.Id + "\">" + call.DisplayProblem + "</div>"
        );
        div.appendTo($("#calls"));
    });
}

function getCalls() {
    return $.ajax({ // Return the promise that $.ajax returns (deferred object)
        type: "Get",
        url: "api/calls",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        buildTable(data);
        Message("Calls Retrived.", "successMsg");
        $("#callModal").modal('hide');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting all Calls.", "errorMsg");
    });
}

function getById(id) {
    var data = $.ajax({
        type: "Get",
        url: "api/call/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        $("#HiddenId").val(data.Id);
        loadProblemsDDL(data.ProblemId);
        loadEmployeeDDL(data.EmployeeId);
        loadTechDDL(data.TechId);
        $("#DateOpenedLabel").text(formatDate(data.DateOpened));
        $("#HiddenDateOpened").val(data.DateOpened);

        if (!data.OpenStatus) {
            $("#DateClosedLabel").text(formatDate(data.DateClosed));
            $("#HiddenDateClosed").val(data.DateClosed);
        } else {
            $("#DateClosedLabel").text("Not Closed");
        }
        $("#CloseCallCheck").prop("checked", !data.OpenStatus);
        $("#NotesTextArea").val(data.Notes);

        $("#HiddenEntity").val(data.Entity64);
        
        Message("Call retrieved", "successMsg");

        if (!data.OpenStatus) {
            // Disable everything...
            $("#ddlProblems").prop("disabled", true);
            $("#ddlEmployees").prop("disabled", true);
            $("#ddlTechs").prop("disabled", true);
            $("#CloseCallCheck").prop("disabled", true);
            $("#NotesTextArea").prop("readonly", "readonly");
            $("#ButtonAction").hide();
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Call.", "errorMsg");
    });
}

function loadEmployeeDDL(empdep) {
    $.ajax({
        type: "Get",
        url: "api/employees",
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        html = "<option value=\"notValid\">Select a Value</option>";
        $("#ddlEmployees").empty();
        $.each(data, function () {
            html += "<option value=\"" + this["Id"] + "\">" + this["Firstname"] + " " + this["Lastname"] + "</option>";
        });
        $("#ddlEmployees").append(html);
        $("#ddlEmployees").val(empdep);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Employees.", "errorMsg");
    });
}

function loadProblemsDDL(prbdep) {
    $.ajax({
        type: "Get",
        url: "api/problems",
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        html = "<option value=\"notValid\">Select a Value</option>";
        $("#ddlProblems").empty();
        $.each(data, function () {
            html += "<option value=\"" + this["Id"] + "\">" + this["Description"] + "</option>";
        });
        $("#ddlProblems").append(html);
        $("#ddlProblems").val(prbdep);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Problems.", "errorMsg");
    });
}

function loadTechDDL(techdep) {
    $.ajax({
        type: "Get",
        url: "api/employees/tech",
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        html = "<option value=\"notValid\">Select a Value</option>";
        $("#ddlTechs").empty();
        $.each(data, function () {
            html += "<option value=\"" + this["Id"] + "\">" + this["Firstname"] + " " + this["Lastname"] + "</option>";
        });
        $("#ddlTechs").append(html);
        $("#ddlTechs").val(techdep);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Technicians.", "errorMsg");
    });
}

$("#CallForm").validate({
    rules: {
        ddlProblems: { required: true, notDefault: true },
        ddlEmployees: { required: true, notDefault: true },
        ddlTechs: { required: true, notDefault: true },
        NotesTextArea: { maxlength: 250, required: true },
    },
    ignore: ".ignore, :hidden",
    errorElement: "div",
    wrapper: "div", // A wrapper around the error message
    messages: {
        ddlProblems: {
            required: "Required field.", notDefault: "Must Select a Value."
        },
        ddlEmployees: {
            required: "Required field.", notDefault: "Must Select a Value."
        },
        ddlTechs: {
            required: "Required field.", notDefault: "Must Select a Value."
        },
        NotesTextArea: {
            required: "Required field.", maxlength: "Must be less then 250 characters."
        },
    }
});

function formatDate(date) {
    var d;
    if (date === undefined) {
        d = new Date(); // No date comming from server
    } else {
        var d = new Date(Date.parse(date)); // Date from the server
    }

    var _day = d.getDate();
    var _month = d.getMonth() + 1;
    var _year = d.getFullYear();
    var _hours = d.getHours();
    var _min = d.getMinutes();
    if (_min < 10) { _min = "0" + _min; }
    return _year + "-" + _month + "-" + _day + " " + _hours + ":" + _min;
}