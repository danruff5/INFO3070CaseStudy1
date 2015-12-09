$(function () {
    $("#LoadButton").click(function () { // Clicke the button.
        Message("Loading...", "defaultMsg");
        $.ajax({ // Load the database
            type: "Delete",
            url: "api/util",
            contentType: "application/json; charset=utf-8"
        }).done(function (data) {
            if (data === true) { // Worked vs. not
                Message("Database loaded", "successMsg");
            } else {
                Message("Database not loaded", "errorMsg");
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Message("Database not loaded", "errorMsg");
        });
    });
});