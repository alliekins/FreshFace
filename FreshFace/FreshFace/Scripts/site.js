


$(document).ready(function () {
    console.log("Accessing service...");

    $.get("../../Stock/Details/5", function (data) {
        console.log("Accessed data: " + data);
        console.log("Company accessed: " + data.CompanyName);
        console.log("Company change: " + data.ChangePrice);
        console.log("Company price: " + data.CurrentPrice);

    });

    console.log("Accessed service.");
});