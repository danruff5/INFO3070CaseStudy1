$(function () {
    getDepartments();

    $("#departmentNames").click(function (e) {
        if (!e) e = window.event;
        var depId = e.target.parentNode.id;

        if (depId == "main") {
            depId = e.target.id; // Clicked on row somewhere else
        }

        if (depId != "department") {
            getById(depId); // Existing Department
            $("#ButtonAction").prop("value", "Update");
            $("#ButtonDelete").show();
        } else { // New Department
            $("#ButtonDelete").hide();
            $("#ButtonAction").prop("value", "Add");
            $("#HiddenId").val("");
            $("#nameTextbox").val("");
            $("#ButtonUpdate").prop("value", "Add");
            $("#ButtonDelete").hide();
        }
    });

    $("#ButtonDelete").click(function () {
        var deleteDep = confirm("Really delete this department?");
        if (deleteDep) {
            $.ajax({
                type: "Delete",
                url: "api/department/" + $("#HiddenId").val(),
                contentType: "application/json; charset=utf-8"
            }).done(function (data) {
                Message(data, "defaultMsg");
                getDepartments();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in delete Department.", "errorMsg");
                $("#employeeModal").modal("hide");
            });
            return !deleteDep;
        } else
            return !deleteDep;
    });

    $("#ButtonAction").click(function () {
        if ($("#ButtonAction").val() === "Update") {
            // Update
            dep = new Object();
            dep.Id = $("#HiddenId").val();
            dep.Entity64 = $("#HiddenEntity").val();
            dep.DepartmentName = $("#nameTextbox").val();

            $.ajax({
                type: "Put",
                url: "api/department",
                data: JSON.stringify(dep),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true
            }).done(function (data) {
                Message(data, "defaultMsg");
                getDepartments();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in update Department.", "errorMsg");
            });
        } else {
            // Create
            dep = new Object();
            dep.DepartmentName = $("#nameTextbox").val();

            $.ajax({
                type: "Post",
                url: "api/department",
                data: JSON.stringify(dep),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true
            }).done(function (data) {
                Message(data, "defaultMsg");
                getDepartments();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in create Department.", "errorMsg");
            });
        }

        return false;
    });
});

function buildTable(data) {
    $("#departmentNames").empty();
    var bg = false;
    departments = data;
    div = $("<div id=\"department\" data-toggle=\"modal\" data-target=\"#departmentModal\" class=\"row trWhite\">");
    div.html("<div class=\"col-lg-12\" id=\"id0\">...Click here to add</div>");
    div.appendTo($("#departmentNames"));
    $.each(data, function (index, dep) {
        var cls = "rowWhite";
        bg ? cls = "rowWhite" : cls = "rowLightGrey";
        bg = !bg;
        div = $("<div id=\"" + dep.Id + "\" data-toggle=\"modal\" data-target=\"#departmentModal\" class=\"row col-lg-12 " + cls + "\">");
        var depId = dep.Id;
        div.html("<div class=\"col-xs-4\" id=\"departmentName" + depId + "\">" + dep.DepartmentName + "</div>");
        div.appendTo($("#departmentNames"));
    });
}

function getDepartments() {
    return $.ajax({ // Return the promise that $.ajax returns (deferred object)
        type: "Get",
        url: "api/departments",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        buildTable(data);
        Message("Departments Retrived.", "successMsg");
        $("#departmentModal").modal('hide');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message(" Error in getting all Departments.", "errorMsg");
    });
}

function getById(id) {
    var data = $.ajax({
        type: "Get",
        url: "api/department/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        $("#HiddenId").val(data.Id);
        $("#HiddenEntity").val(data.Entity64);
        $("#nameTextbox").val(data.DepartmentName);
        Message("Department " + data.DepartmentName + " retrieved", "successMsg");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Department.", "errorMsg");
    });
}