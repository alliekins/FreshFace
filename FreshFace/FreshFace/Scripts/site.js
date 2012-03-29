
$(document).ready(function () {
    console.log("Accessing service...");

    $.get("../../Stock/Details/5", function (data) {
        console.log("Accessed data: " + data);
    });

    console.log("Accessed service.");
});