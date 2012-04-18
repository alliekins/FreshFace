
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
    },

    /**
     * Removes the given stock.
     *
     * @method removeStock
     *
     */
    removeStock: function (name) {
        var stockStr = localStorage.getItem("MyStocks");
        var stocks = JSON.parse(stockStr);
        var index = stocks.indexOf(name);
        if (index != -1) {
            stocks.splice(index, 1);
        }
        localStorage.setItem("MyStocks", JSON.stringify(stocks));
    },

    /**
     * Removes the given stock.
     *
     * @method removeStock
     *
     */
    addStock: function (name) {
        var stockStr = localStorage.getItem("MyStocks");
        var stocks = JSON.parse(stockStr);
        stocks.push(name);
        localStorage.setItem("MyStocks", JSON.stringify(stocks));
    }

};

$(document).ready(function () {

    var stocks = [];
    if (localStorage.getItem("MyStocks") === null ||
        typeof localStorage.getItem("MyStocks") === "undefined") {
        stocks = ["GOOG", "MSFT", "AAPL", "AMZN"];
        stockStr = JSON.stringify(stocks);
        localStorage.setItem("MyStocks", stockStr);
    } else {
        var stockStr = localStorage.getItem("MyStocks");
        stocks = JSON.parse(stockStr);
    }

    for (var i = 0; i < stocks.length; i++) {

        var url = "../Stock/Details/" + stocks[i];
        $.get("../Stock/Details/" + stocks[i], function (data) {
            if (data === "") {
                Debug.log("ERROR: returned data from getting stocks was empty string.");
                return;
            }

            var stockRow = document.createElement("tr");
            var stockName = document.createElement("td");
            var stockLink = document.createElement("a");
            var stockPrice = document.createElement("td");
            var stockChange = document.createElement("td");
            var stockExtra = document.createElement("td");
            var stockRem = document.createElement("a");

            $(stockLink).attr("href", "http://finance.yahoo.com/q?s=" + data.CompanyName);
            $(stockLink).html(data.CompanyName);
            $(stockName).append(stockLink);

            $(stockPrice).html(data.CurrentPrice.toFixed(2));

            $(stockChange).html(data.ChangePrice.toFixed(2));

            $(stockRem).attr("id", data.CompanyName);
            $(stockRem).attr("title", "Remove " + data.CompanyName);
            $(stockRem).addClass("remove");
            $(stockRem).attr("href", "");
            $(stockRem).html("X");
            $(stockRem).click(function () {
                FreshFace.removeStock(data.CompanyName);
            });
            $(stockExtra).append(stockRem);

            $(stockRow).append(stockName);
            $(stockRow).append(stockPrice);
            $(stockRow).append(stockChange);
            $(stockRow).append(stockExtra);

            $("#stocks").append(stockRow);
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
