
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

$(document).ready(function () {

    var s = getCookie("curStocks");
    var stocks;

    if (s == null) {
        stocks = new Array("GOOG", "MSFT", "AAPL", "AMZN");
        setCookie("curStocks", stocks, 7);
    } else if (s.length == "") {
        $("#stocks").append("<tr><td>Add</td><td>Stocks</td><td>Below</td><tr>");
    } else {
        stocks = s.split(',');
    }

    for (var i = 0; i < stocks.length; i++) {

        var url = "../Stock/Details/" + stocks[i];
        $.get("../Stock/Details/" + stocks[i], function (data) {
            $("#stocks").append("<tr><td><a href=\"http://finance.yahoo.com/q?s=" + data.CompanyName + "\">"
            + data.CompanyName + "</a></td><td>" + data.CurrentPrice.toFixed(2) + "</td><td> "
             + data.ChangePrice.toFixed(2) + "</td><td><a id=\"" + data.CompanyName + "\" class=\"remove\" href=\"\">X</a></td></tr>");

        });
    }
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

//Function that creates a cookie
//http://www.w3schools.com/js/js_cookies.asp
function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

//Function that getsa cookie
//http://www.w3schools.com/js/js_cookies.asp
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

