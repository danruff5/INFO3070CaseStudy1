$(function () {
    $("#LoadButton").click(function () {
        $("#message").text("Loading...");
        $.ajax({
            type: "Delete",
            url: "api/util",
            contentType: "application/json; charset=utf-8"
        }).done(function (data) {
            if (data === true) {
                $("#message").text("Database loaded");
            } else {
                $("#message").text("Database not loaded");
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $("#message").text("Database not loaded");
        });
    });
});