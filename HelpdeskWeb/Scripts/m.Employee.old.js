//
// mobileexample1
//     jQuery code that supports Info3070 mobile example1        
//     2015-10-01
//
$(function () {
    $("#footer1").load("m.include.html");
    $("#footer2").load("m.include.html");
    getAll('');

    //   Main display click
    $('#main').click(function (e) {  // click on any row

        var empId = e.target.id;

        if (empId.length === 24) {
            getById(empId);
        }
        else
            return false;  // arrow wasn't clicked
    });

});  // main jquery function

// build initial table
function buildTable(data) {
    $('#main').empty();
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
    li.appendTo($('#main'));

    $.each(data, function (index, emp) {
        var empId = emp.Id;
        li = $('<li id="' + empId + '" class="ui-li-divider ui-bar-inherit" style="padding:2%">' +
               '    <fieldset class="ui-grid-d">' +
               '        <div class="ui-block-a" style="width:15%;">&nbsp;' +
               '            <img src="data:image/png;base64,' + emp.StaffPicture64 + '" style="max-width:25px; max-height:25px;" />' + 
               '        </div>' +
               '        <div class="ui-block-b" style="width:20%;">' + emp.Title + '</div>' +
               '        <div class="ui-block-c" style="width:20%;">' + emp.Firstname + '</div>' +
               '        <div class="ui-block-d" style="width:30%;">' + emp.Lastname + '</div>' +
               '        <div class="ui-block-e" style="width:15%;">' +
               '            <a href="#mobilemodal" data-transition="flip" class="ui-btn-icon-right ui-icon-carat-r" id="' + empId +'">' +
               '        </div>' +
               '    </fieldset>' +
               '</li>');
        li.appendTo($('#main'));
    }); // each
}

//  copy Employee info to modal
function copyInfoToModal(emp) {
    $('#TextBoxTitle').val(emp.Title);
    $('#TextBoxFirstname').val(emp.Firstname);
    $('#TextBoxLastname').val(emp.Lastname);
    $('#TextBoxPhone').val(emp.Phoneno);
    $('#TextBoxEmail').val(emp.Email);
    $("#isTechCheck").prop('checked', emp.IsTech);
}

//   ajax calls
function getAll(msg) {
    $('#LabelStatus').text("Employees Loading...");

    ajaxCall('Get', 'api/employees', '')
    .done(function (data) {
        buildTable(data);
        if (msg == '')
            $('#LabelStatus').text('Employees Loaded');
        else
            $('#LabelStatus').text(msg + ' - ' + 'Employees Loaded');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        errorRoutine(jqXHR);
    });
}

function getById(empId) {
    ajaxCall('Get', 'api/employee/' + empId, '')
    .done(function (data) {
        copyInfoToModal(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        errorRoutine(jqXHR);
    });
}

// ajax Call - returns promise
function ajaxCall(type, url, data) {
    return $.ajax({ // return the promise that `$.ajax` returns
        type: type,
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        processData: true,
    });
}

// commmon error
function errorRoutine(jqXHR) {
    if (jqXHR.responseJSON == null) {
        $('#LabelStatus').text(jqXHR.responseText);
    }
    else {
        $('#LabelStatus').text(jqXHR.responseJSON.Message);
    }
}