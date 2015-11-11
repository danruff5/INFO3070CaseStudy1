QUnit.test("Multitier Tests", function (assert) {
    assert.async(9);

    // Get all employees
    $.ajax({
        type: "Get",
        url: "api/employees"
    }).then(function (data) {
        ok(data.length - 1 > 0, "Found " + (data.length - 1) + " Employees");
    });

    // Add new Employee
    $.ajax({
        type: "Get",
        url: "api/departments"
    }).then(function (data) {
        var emp = {
            Title: "Mr.",
            Firstname: "Bob",
            Lastname: "Bobson",
            Email: "bb@abc.ca",
            Phoneno: "(555)555-1111",
            DepartmentId: data[0].Id
        };
        return $.ajax({
            type: "Post",
            url: "api/employee",
            data: JSON.stringify(emp),
            contentType: "application/json"
        });
    }).then(function (data) {
        ok(data === "Employee Bobson Created", "Employee Bobson has been added.");
        return $.ajax({
            type: "Get",
            url: "api/employees"
        });
    }).then(function (data) {
        ok(data.length - 1 > 0, "New Employee " + data[data.length - 1].Lastname + " just added was reterived, for delete.");
        var emp = data[data.length - 1];
        return $.ajax({
            type: "Delete",
            url: "api/employee/" + emp.Id,
        });
    }).then(function (data) {
        ok(data === "Employee Deleted", "Employee Bobson was deleted.")
    });


    // Update employee
    $.ajax({
        type: "Get",
        url: "api/employees"
    }).then(function (data) {
        return $.ajax({
            type: "Get",
            url: "api/employee/" + data[2].Id
        });
    }).then(function (data) {
        ok(data.Lastname == "Andmirrors", "Employee " + data.Id + " retreived for regular update");
        data.Email = "XX@NotAbc.com";
        return $.ajax({
            type: "Put",
            url: "api/employee",
            data: JSON.stringify(data),
            contentType: "application/json"
        });
    }).then(function (data) {
        var updateOk = data.indexOf("not");
        ok(updateOk === -1, data);
    });

    // Concurrency update with employee
    var emp = {};
    $.ajax({
        type: "Get",
        url: "api/employees"
    }).then(function (data) {
        return $.ajax({
            type: "Get",
            url: "api/employee/" + data[1].Id
        });
    }).then(function (data) {
        ok(data.Lastname == "Pincher", "Employee Pincher retreived for concurrency");
        emp = data;
        return $.ajax({
            type: "Put",
            url: "api/employee",
            data: JSON.stringify(emp),
            contentType: "application/json"
        });
    }).then(function (data) {
        var updateOk = data.indexOf("not");
        ok(updateOk === -1, data);

        return $.ajax({
            type: "Put",
            url: "api/employee",
            data: JSON.stringify(emp),
            contentType: "application/json"
        });
    }).then(function (data) {
        var updateOk = data.indexOf("stale");
        ok(updateOk > 0, "Second update: " + data);
    });
});