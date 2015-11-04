$(function () {
    getEmployees();

    $("#employeeNames").click(function (e) {
        if (!e) e = window.event;
        var empId = e.target.parentNode.id;

        if (empId == "main") {
            empId = e.target.id; // Clicked on row somewhere else
        }

        if (empId != "employee") {
            getById(empId); // Existing employee
            $("#ButtonAction").prop("value", "Update");
            $("#ButtonDelete").show();
        } else { // New employee
            $("#ButtonDelete").hide();
            $("#ButtonAction").prop("value", "Add");
            $("#HiddenId").val("");
            $("#titleTextbox").val("");
            $("#firstnameTextbox").val("");
            $("#lastnameTextbox").val("");
            $("#phoneTextbox").val("");
            $("#emailTextbox").val("");
            $("#ButtonUpdate").prop("value", "Add");
            $("#ButtonDelete").hide();
            loadDepartmentDDL(-1);
        }
    });

    $("#ButtonDelete").click(function () {
        var deleteEmp = confirm("Really delete this employee?");
        if (deleteEmp) {
            //$("#message").text("Loading...");
            $.ajax({
                type: "Delete",
                url: "api/employee/" + $("#HiddenId").val(),
                contentType: "application/json; charset=utf-8"
            }).done(function (data) {
                $("#message").text(data);
                getEmployees();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                $("#message").text("Error in delete Employee.");
                $("#employeeModal").modal("hide");
            });
            return deleteEmp;
        } else
            return deleteEmp;
    });

    $("#ButtonAction").click(function () {
        //$("#message").text("Loading...");
        if ($("#ButtonAction").val() === "Update") {
            // Update
            emp = new Object();
            emp.Id = $("#HiddenId").val();
            emp.Entity64 = $("#HiddenEntity").val();
            emp.Title = $("#titleTextbox").val();
            emp.Firstname = $("#firstnameTextbox").val();
            emp.Lastname = $("#lastnameTextbox").val();
            emp.Phoneno = $("#phoneTextbox").val();
            emp.Email = $("#emailTextbox").val();
            emp.DepartmentId = $("#ddlDepts").val();

            $.ajax({
                type: "Put",
                url: "api/employee",
                data: JSON.stringify(emp),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true
            }).done(function (data) {
                $("#message").text(data);
                getEmployees();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                $("#message").text("Error in update Employee.");
            });
        } else {
            // Create
            emp = new Object();
            emp.Title = $("#titleTextbox").val();
            emp.Firstname = $("#firstnameTextbox").val();
            emp.Lastname = $("#lastnameTextbox").val();
            emp.Phoneno = $("#phoneTextbox").val();
            emp.Email = $("#emailTextbox").val();
            emp.DepartmentId = $("#ddlDepts").val();

            $.ajax({
                type: "Post",
                url: "api/employee",
                data: JSON.stringify(emp),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true
            }).done(function (data) {
                $("#message").text(data);
                getEmployees();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                $("#message").text("Error in create Employee.");
            });
        }
        return false;
    });
});

function buildTable(data) {
    $("#employeeNames").empty();
    var bg = false;
    problems = data;
    div = $("<div id=\"employee\" data-toggle=\"modal\" data-target=\"#employeeModal\" class=\"row trWhite\">");
    div.html("<div class=\"col-lg-12\" id=\"id0\">...Click here to add</div>");
    div.appendTo($("#employeeNames"));
    $.each(data, function (index, emp) {
        var cls = "rowWhite";
        bg ? cls = "rowWhite" : cls = "rowLightGrey";
        bg = !bg;
        div = $("<div id=\"" + emp.Id + "\" data-toggle=\"modal\" data-target=\"#employeeModal\" class=\"row col-lg-12 " + cls + "\">");
        var empId = emp.Id;
        div.html("<div class=\"col-xs-4\" id=\"employeeTitle" + empId + "\">" + emp.Title + "</div>"
            + "<div class=\"col-xs-4\" id=\"employeeFirstname" + empId + "\">" + emp.Firstname + "</div>"
            + "<div class=\"col-xs-4\" id=\"employeeLastname" + empId + "\">" + emp.Lastname + "</div>"
        );
        div.appendTo($("#employeeNames"));
    });
}

function getEmployees() {
    //$("#message").text("Loading...");
    return $.ajax({ // Return the promise that $.ajax returns (deferred object)
        type: "Get",
        url: "api/employees",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        buildTable(data);
        $("#message").append(" Employees Retrived.");
        $("#employeeModal").modal('hide');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#message").append(" Error in getting all Employees.");
    });
}

function getById(id) {
    //$("#message").text("Loading...");
    var data = $.ajax({
        type: "Get",
        url: "api/employee/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        $("#HiddenId").val(data.Id);
        $("#HiddenEntity").val(data.Entity64);
        $("#titleTextbox").val(data.Title);
        $("#firstnameTextbox").val(data.Firstname);
        $("#lastnameTextbox").val(data.Lastname);
        $("#phoneTextbox").val(data.Phoneno);
        $("#emailTextbox").val(data.Email);
        loadDepartmentDDL(data.DepartmentId);
        $("#message").text("Employee " + data.Firstname + " retrieved");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#message").text("Error in getting Employee.");
    });
}

function loadDepartmentDDL(empdep) {
    $("#message").text("Loading...");
    $.ajax({
        type: "Get",
        url: "api/departments",
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        html = "";
        $("#ddlDepts").empty();
        $.each(data, function () {
            html += "<option value=\"" + this["Id"] + "\">" + this["DepartmentName"] + "</option>";
        });
        $("#ddlDepts").append(html);
        $("#ddlDepts").val(empdep);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#message").text("Error in getting Departments.");
    });
}