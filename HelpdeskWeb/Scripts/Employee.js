$(function () {
    $.validator.addMethod("validTitle", function (value, element) { // custom rule
        return this.optional(element) || (value == "Mr." || value == "Ms." || value == "Mrs." || value == "Dr.");
    }, "");

    $.validator.addMethod("notDefault", function (value, element) { // custom rule
        return this.optional(element) || (value != "notValid");
    }, "");

    getEmployees();

    $("#employeeNames").click(function (e) {
        var validator = $('#EmployeeForm').validate();
        validator.resetForm();

        if (!e) e = window.event;
        var empId = e.target.parentNode.id;

        if (empId == "main") {
            empId = e.target.id; // Clicked on row somewhere else
        }

        $("#ButtonAction").attr("disabled", true);

        if (empId != "employee") {
            getById(empId); // Existing employee
            Message("Loading...", "defaultMsg");

            Message("Employee Found!", "successMsg");

            $("#ButtonAction").attr("disabled", false);

            $("#ButtonAction").prop("value", "Update");
            $("#ButtonDelete").show();
        } else { // New employee
            $("#ButtonDelete").hide();
            $("#ButtonAction").prop("value", "Add");
            $("#ButtonAction").prop("disabled", false);
            $("#HiddenId").val("");
            $("#HiddenEntity").val("");
            $("#HiddenStaffPicture64").val("");
            $("#ImageHolder").html("");
            $("#titleTextbox").val("");
            $("#firstnameTextbox").val("");
            $("#lastnameTextbox").val("");
            $("#phoneTextbox").val("");
            $("#emailTextbox").val("");
            $("#HiddenStaffPicture64").val($("#HiddenDefaultPicture64").val());
            $("#ImageHolder").html(
                '<img id="StaffPicture" height="120" width="110" src="data:image/png;base64,'
                + $("#HiddenStaffPicture64").val()
                + '" />'
            );
            loadDepartmentDDL(-1);
        }

        return true;
    });

    $("#ButtonDelete").click(function () {
        var deleteEmp = confirm("Really delete this employee?");
        if (deleteEmp) {
            $.ajax({
                type: "Delete",
                url: "api/employee/" + $("#HiddenId").val(),
                contentType: "application/json; charset=utf-8"
            }).done(function (data) {
                Message(data, "defaultMsg");
                getEmployees();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Message("Error in delete Employee.", "errorMsg");
                $("#employeeModal").modal("hide");
            });
            return false; // https://support.microsoft.com/en-us/kb/942051
        } else
            return true;
    });

    $("#ButtonAction").click(function () {
        if ($("#EmployeeForm").valid()) {
            Message("Data Validated by jQuery!", "successMsg");

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
            Message("Please correct errors.", "errorMsg");
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
        emp.IsTech = $('#isTechCheck').is(':checked');

        $.ajax({
            type: "Put",
            url: "api/employee",
            data: JSON.stringify(emp),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true
        }).done(function (data) {
            $("#message").text(data);
            Message(data, "defaultMsg");
            getEmployees();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Message("Error in update Employee.", "errorMsg");
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
        emp.IsTech = $('#isTechCheck').is(':checked');

        $.ajax({
            type: "Post",
            url: "api/employee",
            data: JSON.stringify(emp),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true
        }).done(function (data) {
            Message(data, "defaultMsg");
            getEmployees();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Message("Error in create Employee.", "errorMsg");
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
        Message("Employees Retrived.", "successMsg");
        $("#employeeModal").modal('hide');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting all Employees.", "errorMsg");
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
        $("#isTechCheck").prop('checked', data.IsTech);
        $("#HiddenStaffPicture64").val(data.StaffPicture64);
        Message("Employee " + data.Firstname + " retrieved", "successMsg");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Employee.", "errorMsg");
    });
}

function loadDepartmentDDL(empdep) {
    $.ajax({
        type: "Get",
        url: "api/departments",
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        html = "<option value=\"notValid\">Select a Value</option>";
        $("#ddlDepts").empty();
        $.each(data, function () {
            html += "<option value=\"" + this["Id"] + "\">" + this["DepartmentName"] + "</option>";
        });
        $("#ddlDepts").append(html);
        $("#ddlDepts").val(empdep);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Departments.", "errorMsg");
    });
}

$("#EmployeeForm").validate({
    rules: {
        titleTextbox: { maxlength: 4, required: true, validTitle: true },
        firstnameTextbox: { maxlength: 25, required: true },
        lastnameTextbox: { maxlength: 25, required: true },
        emailTextbox: { maxlength: 40, required: true, email: true },
        phoneTextbox: { maxlength: 15, required: true },
        ddlDepts: { required: true, notDefault: true }
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
        },
        ddlDepts: {
            required: "Required field.", notDefault: "Must Select a Value."
        }
    }
});