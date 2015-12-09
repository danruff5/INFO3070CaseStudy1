$(function () {
    $.validator.addMethod("validTitle", function (value, element) { // custom rule
        return this.optional(element) || (value == "Mr." || value == "Ms." || value == "Mrs." || value == "Dr.");
    }, "");

    getEmployees();

    $("#employeeNames").click(function (e) {
        var validator = $('#EmployeeForm').validate();
        validator.resetForm();

        if (!e) e = window.event;
        var empId = e.target.id;

        if (empId.length === 24) {

            $("#ButtonAction").attr("disabled", true);

            getById(empId); // Existing employee
            $("#LabelStatus").text("Loading");

            $("#LabelStatus2").text("Employee Found!");

            $("#ButtonAction").attr("disabled", false);

            $("#ButtonAction").prop("value", "Update");
            $("#ButtonDelete").show();

            return true;
        } else
            return false;
    });

    $("#ButtonDelete").click(function () {
        var deleteEmp = confirm("Really delete this employee?");
        if (deleteEmp) {
            $.ajax({
                type: "Delete",
                url: "api/employee/" + $("#HiddenId").val(),
                contentType: "application/json; charset=utf-8"
            }).done(function (data) {
                $("#LabelStatus").text(data);
                getEmployees();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                $("#LabelStatus").text("Error in delete Employee.");
                //$("#employeeModal").modal("hide");
                $("body").pagecontainer("change", "#mobilepage", { transition: "flip" }); // Change the page.
                // http://stackoverflow.com/questions/19174611/how-to-change-page-in-jquery-mobile-1-4-beta
            });
            return false; // https://support.microsoft.com/en-us/kb/942051
            // Must be false to stop the form from POSTing.
        } else
            return true;
    });

    $("#ButtonAction").click(function () {
        if ($("#EmployeeForm").valid()) {
            $("#LabelStatus2").text("Data Validated by jQuery!");
            $("#LabelStatus2").css("color", "#0F0");

            doUpdate();
        }
        else {
            $("#LabelStatus2").text("Please correct errors.");
            $("#LabelStatus2").css("color", "#F00");
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
        emp.IsTech = $('#isTechCheck').is(':checked');
        emp.StaffPicture64 = $("#HiddenStaffPicture64").val();

        $.ajax({
            type: "Put",
            url: "api/employee",
            data: JSON.stringify(emp),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true
        }).done(function (data) {
            $("#LabelStatus").text(data);
            getEmployees();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $("#LabelStatus").text("Error in update Employee.");
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
        emp.IsTech = $('#isTechCheck').is(':checked');
        emp.StaffPicture64 = $("#HiddenStaffPicture64");

        $.ajax({
            type: "Post",
            url: "api/employee",
            data: JSON.stringify(emp),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true
        }).done(function (data) {
            $("#LabelStatus").text(data);
            getEmployees();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $("#LabelStatus").text("Error in create Employee.");
        });
    }
}

function buildTable(data) {
    $('#employeeNames').empty();
    var bg = false;
    employees = data; // copy to global var
    li = $("<li data-role=\"list-divider\" id=\"emphead\" role=\"heading\">" +
              "<fieldset class=\"ui-grid-c\"style=\"padding:3%;background-color:darkgray;color:white;\">" +
              "   <div class=\"ui-block-a\" style=\"width:15%;\">&nbsp;</div>" +
              "   <div class=\"ui-block-b\" style=\"width:20%;\">Title</div>" +
              "   <div class=\"ui-block-c\" style=\"width:20%;text-align:center;\">First</div>" +
              "   <div class=\"ui-block-d\" style=\"width:30%;text-align:center;\">Last</div>" +
              "</fieldset>" +
           "</li>");
    li.appendTo($('#employeeNames')); // Load the header.

    $.each(data, function (index, emp) { // Each employee
        var empId = emp.Id;
        li = $('<li id="' + empId + '" class="ui-li-divider ui-bar-inherit" style="padding:2%">' +
               '    <fieldset class="ui-grid-d">' +
               '        <div class="ui-block-a" style="width:15%;">&nbsp;' + // special picture 
               '            <img src="data:image/png;base64,' + emp.StaffPicture64 + '" style="max-width:25px; max-height:25px;" />' +
               '        </div>' +
               '        <div class="ui-block-b" style="width:15%;">' + emp.Title + '</div>' +
               '        <div class="ui-block-c" style="width:25%;">' + emp.Firstname + '</div>' +
               '        <div class="ui-block-d" style="width:30%;">' + emp.Lastname + '</div>' +
               '        <div class="ui-block-e" style="width:15%;">' +
               '            <a href="#mobilemodal" data-transition="flip" class="ui-btn-icon-right ui-icon-carat-r" id="' + empId + '">' +
               '        </div>' +
               '    </fieldset>' +
               '</li>');
        li.appendTo($('#employeeNames'));
    }); // each
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
        $("#LabelStatus").append(" Employees Retrived.");
        //$("#employeeModal").modal('hide');
        $("body").pagecontainer("change", "#mobilepage", { transition: "flip" });
        // Change page.
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#LabelStatus").append(" Error in getting all Employees.");
    });
}

function getById(id) {
    var data = $.ajax({
        type: "Get",
        url: "api/employee/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true
    }).done(function (data) { // Load the employee information
        $("#HiddenId").val(data.Id);
        $("#HiddenEntity").val(data.Entity64);
        $("#titleTextbox").val(data.Title);
        $("#firstnameTextbox").val(data.Firstname);
        $("#lastnameTextbox").val(data.Lastname);
        $("#phoneTextbox").val(data.Phoneno);
        $("#emailTextbox").val(data.Email);
        loadDepartmentDDL(data.DepartmentId);
        $("#isTechCheck").prop('checked', data.IsTech);
        $("#HiddenStaffPicture64").val(data.StaffPicture64);
        $("#LabelStatus").text("Employee " + data.Firstname + " retrieved");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#LabelStatus").text("Error in getting Employee.");
    });
}

function loadDepartmentDDL(empdep) { // Get the departments and load the right one.
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
        $("#ddlDepts").val(empdep).selectmenu('refresh');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#LabelStatus").text("Error in getting Departments.");
    });
}

$("#EmployeeForm").validate({ // Validation rules.
    rules: {
        titleTextbox: { maxlength: 4, required: true, validTitle: true },
        firstnameTextbox: { maxlength: 25, required: true },
        lastnameTextbox: { maxlength: 25, required: true },
        emailTextbox: { maxlength: 40, required: true, email: true },
        phoneTextbox: { maxlength: 15, required: true },
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