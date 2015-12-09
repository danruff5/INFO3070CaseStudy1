$(function () {
    // Custom rule for employee title.
    $.validator.addMethod("validTitle", function (value, element) {
        return this.optional(element) || (value == "Mr." || value == "Ms." || value == "Mrs." || value == "Dr.");
    }, "");

    // Custome rule for non default value for dropdowns.
    $.validator.addMethod("notDefault", function (value, element) { // custom rule
        return this.optional(element) || (value != "notValid");
    }, "");

    getEmployees(); // Get all the employees and build table.

    $("#employeeNames").click(function (e) { // Clicked on table.
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
        } else { // New employee, set all to default.
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
            // Use a default picture stored in hidden html input.
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
            // Causing the form to post after the ajax call.
        } else
            return true;
    });

    $("#ButtonAction").click(function () {
        if ($("#EmployeeForm").valid()) { // Check the form.
            Message("Data Validated by jQuery!", "successMsg");

            var reader = new FileReader();
            var file = $("#fileUpload")[0].files[0];
            if (file !== undefined) { // If the user gave a file.
                                      // convert it and save it in the hidden input
                reader.readAsBinaryString(file);

                reader.onload = function (readerEvt) {
                    var binaryString = reader.result;
                    var encodedString = btoa(binaryString);
                    $("#HiddenStaffPicture64").val(encodedString);

                    doUpdate(); // Update or Create
                }
            } else {
                doUpdate(); // Update or Create without changing picture
            }
        }
        else {
            Message("Please correct errors.", "errorMsg");
        }
        return false;
    });
}); // jQuery main function

function doUpdate() {
    if ($("#ButtonAction").val() === "Update") {
        // Update
        emp = new Object(); // Create employee object.
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
            Message(data, "defaultMsg");
            getEmployees();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Message("Error in update Employee.", "errorMsg");
        });
    } else {
        // Create
        emp = new Object(); // Create employee object.
        emp.Title = $("#titleTextbox").val();
        emp.Firstname = $("#firstnameTextbox").val();
        emp.Lastname = $("#lastnameTextbox").val();
        emp.Phoneno = $("#phoneTextbox").val();
        emp.Email = $("#emailTextbox").val();
        emp.DepartmentId = $("#ddlDepts").val();
        emp.StaffPicture64 = $("#HiddenStaffPicture64").val();;
        emp.IsTech = $('#isTechCheck').is(':checked');

        $.ajax({ // Send it!
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

function buildTable(data) { // Create the Employee table.
    $("#employeeNames").empty();
    var bg = false;
    problems = data;
    div = $("<div id=\"employee\" data-toggle=\"modal\" data-target=\"#employeeModal\" class=\"row trWhite\">");
    div.html("<div class=\"col-lg-12\" id=\"id0\">...Click here to add</div>");
    div.appendTo($("#employeeNames"));
    $.each(data, function (index, emp) { // Each employee
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

function getEmployees() { // Get all employees and build that table.
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

function getById(id) { // Get a single employee.
    var data = $.ajax({
        type: "Get",
        url: "api/employee/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) {
        // Set all of fields from the employee.
        $("#HiddenId").val(data.Id);
        $("#HiddenEntity").val(data.Entity64);
        $("#titleTextbox").val(data.Title);
        $("#firstnameTextbox").val(data.Firstname);
        $("#lastnameTextbox").val(data.Lastname);
        $("#phoneTextbox").val(data.Phoneno);
        $("#emailTextbox").val(data.Email);
        loadDepartmentDDL(data.DepartmentId);
        $("#ImageHolder").html( // Special picture format.
            '<img id="StaffPicture" height="120" width="110" src="data:image/png;base64,'
            + data.StaffPicture64
            + '" />'
        );
        $("#isTechCheck").prop('checked', data.IsTech);
        $("#HiddenStaffPicture64").val(data.StaffPicture64); // Save the base 64 version
        Message("Employee " + data.Firstname + " retrieved", "successMsg");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Message("Error in getting Employee.", "errorMsg");
    });
}

function loadDepartmentDDL(empdep) { // Load the department drop down list.
    $.ajax({
        type: "Get",
        url: "api/departments",
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        html = "<option value=\"notValid\">Select a Value</option>"; // Default option
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

$("#EmployeeForm").validate({ // Validation rules.
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