
// A singleton in JS!
// Close enough, anyway


/**
* Global functionality for FreshFace project.
*
* @class FreshFace
* @global
*
*/
var FreshFace = {

    /**
     * Log out of session on server.
     *
     * @method logOff
     *
     */
    logOff: function () {
        $.post('../Account/LogOff', function (resp) {
            // Logging off is always successful, no need to check response
            window.location.href = '../Account/LogOn';
        });
    },

    /**
     * Log into a session on server, given FB data.
     *
     * @method logOn
     * @param (Object) data the data to send to server
     *
     */
    logOn: function (data) {
        $.post("../Account/LogOn", data, function (resp) {
            if (resp.Success) {
                window.location.href = '../Home/Index';
            }
        });
    }
};


// EXAMPLE CODE ONLY
// Getting a stock from the server
$(document).ready(function () {
    Debug.log("Accessing service...");

    $.get("../Stock/Details/5", function (data) {
        Debug.log("Accessed data: " + data);
        Debug.log("Company accessed: " + data.CompanyName);
        Debug.log("Company change: " + data.ChangePrice);
        Debug.log("Company price: " + data.CurrentPrice);

    });
});

// Turns calendars into FullCalendars
// http://arshaw.com/fullcalendar/docs/usage/
$(document).ready(function () {
    $(".calendar").fullCalendar({
        editable: false,
        header: {
            left: 'title',
            center: '',
            right: 'next,prev today'
        }
    });
});