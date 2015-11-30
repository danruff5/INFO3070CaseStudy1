$(function () {
    $("#LoadButton").click(function () {
        Message("Loading...", "defaultMsg");
        $.ajax({
            type: "Delete",
            url: "api/util",
            contentType: "application/json; charset=utf-8"
        }).done(function (data) {
            if (data === true) {
                Message("Database loaded", "successMsg");
            } else {
                Message("Database not loaded", "errorMsg");
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Message("Database not loaded", "errorMsg");
        });
    });
});