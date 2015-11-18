$(function () {
    getEmployees();

    $("#employeeNames").click(function (e) {
        var validator = $('#EmployeeForm').validate();
        validator.resetForm();

        $("#message").text("Loading...");

        if (!e) e = window.event;
        var empId = e.target.parentNode.id;

        if (empId == "main") {
            empId = e.target.id; // Clicked on row somewhere else
        }

        $("#ButtonAction").attr("disabled", true);

        if (empId != "employee") {
            getById(empId); // Existing employee

            $("#message2").text("Employee found!");
            $("#message2").css({ "color": "green" });
            $("#ButtonAction").attr("disabled", false);

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
            // TODO: Make the default picture.... From default user in database???
            $("#ButtonUpdate").prop("value", "Add");
            $("#ButtonDelete").hide();
            loadDepartmentDDL(-1);
        }
    });

    $("#ButtonDelete").click(function () {
        var deleteEmp = confirm("Really delete this employee?");
        if (deleteEmp) {
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
        if ($("#EmployeeForm").valid()) {
            $("#message2").text("Data Validated by jQuery!");
            $("#message2").css({ "color": "green" });

            var reader = new FileReader();
            var file = $("#fileUpload")[0].files[0];
            if (file !== undefined) {
                reader.readAsBinaryString(file);

                reader.onload = function (readerEvt) {
                    var binaryString = reader.result;
                    var encodedString = btoa(binaryString);
                    $("#HiddenStaffPicture64").val(encodedString);

                    doUpdate();
                }
            } else {
                doUpdate();
            }
        }
        else {
            $("#message2").text("Please correct errors.");
            $("#message2").css({ "color": "red" });
        }
        return false;
    });
});

function doUpdate() {
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
        emp.StaffPicture64 = $("#HiddenStaffPicture64").val();
        emp.IsTech = $("#isTechCheck").val();

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
        emp.StaffPicture64 = $("#HiddenStaffPicture64").val();;
        emp.IsTech = $("#isTechCheck").val();

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
}

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

    $.validator.addMethod("validTitle", function (value, element) { // custom rule
        return this.optional(element) || (value == "Mr." || value == "Ms." || value == "Mrs." || value == "Dr.");
    }, "");
}

function getEmployees() {
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
        $("#ImageHolder").html(
            '<img id="StaffPicture" height="120" width="110" src="data:image/png;base64,'
            + data.StaffPicture64
            + '" />'
        );
        $("#isTechCheck").val(data.IsTech);
        $("#HiddenStaffPicture64").val(data.StaffPicture64);
        $("#message").text("Employee " + data.Firstname + " retrieved");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#message").text("Error in getting Employee.");
    });
}

function loadDepartmentDDL(empdep) {
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

$("#EmployeeForm").validate({
    rules: {
        titleTextbox: { maxlength: 4, required: true, validTitle: true },
        firstnameTextbox: { maxlength: 25, required: true },
        lastnameTextbox: { maxlength: 25, required: true },
        emailTextbox: { maxlength: 40, required: true, email: true },
        phoneTextbox: { maxlength: 15, required: true }
    },
    ignore: ".ignore, :hidden",
    errorElement: "div",
    wrapper: "div", // A wrapper around the error message
    messages: {
        titleTextbox: {
            required: "Required field.", maxlength: "Must be 1-4 characters.", validTitle: "Mr. Ms. Mrs. or Dr."
        },
        firstnameTextbox: {
            required: "Required field.", maxlength: "Must be 1-25 characters."
        },
        lastnameTextbox: {
            required: "Required field.", maxlength: "Must be 1-25 characters."
        },
        emailTextbox: {
            required: "Required field.", maxlength: "Must be 1-15 characters."
        },
        phoneTextbox: {
            required: "Required field.", maxlength: "Must be 1-40 characters.", email: "Needs to be a valid email format"
        }
    }
});