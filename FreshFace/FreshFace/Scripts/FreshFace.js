﻿
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
    },

    generatePost: function (post, type) {
        // A post should have:
        // post.from.name
        // post.name
        // and others!
        // A post may have:
        // post.story
        // post.link

        if (typeof type !== "undefined") {
            post.type = type;
        }

        var article = document.createElement("article");
        var tLink = undefined;
        var title = document.createElement("h6");
        var story = document.createElement("p");
        var photo = "";

        $(article).addClass("ff-feed-item");
        $(title).addClass("ff-feed-from");
        $(story).addClass("ff-feed-story");

        var titleText = "";
        if (post.name) {
            titleText = post.name;
        } else if (post.from.name) {
            titleText = "From " + post.from.name + ":";
        } else {
            titleText = post.caption;
        }
        if (post.picture && (post.type === "photo" || post.type === "video")) {
            photo = "<img src=\"" + post.picture + "\"/>";
        }

        if (post.link) {
            tLink = document.createElement("a");
            tLink.href = post.link;
            $(tLink).append(title);
        }

        $(title).text(titleText);

        var storyText = "";
        if (post.story) {
            storyText = post.story;
        } else if (post.message) {
            storyText = post.message;
        } else if (post.description) {
            storyText = post.description;
        }
        $(story).text(storyText);

        if (tLink) {
            $(article).append(tLink).append(story);
        } else {
            $(article).append(title).append(story);
        }

        $(article).append(photo);
        $(article).append("<hr />");

        return article;
    },

    prependPost: function (feedPar, postData, type) {
        var article = FreshFace.generatePost(postData, type);

        $(feedPar).prepend(article);
    },

    appendPost: function (feedPar, postData, type) {
        var article = FreshFace.generatePost(postData, type);

        $(feedPar).append(article);
    },

    appendStock: function (stockData) {
        var stockRow = document.createElement("tr");
        var stockName = document.createElement("td");
        var stockLink = document.createElement("a");
        var stockPrice = document.createElement("td");
        var stockChange = document.createElement("td");
        var stockExtra = document.createElement("td");
        var stockRem = document.createElement("a");

        $(stockLink).attr("href", "http://finance.yahoo.com/q?s=" + stockData.CompanyName);
        $(stockLink).html(stockData.CompanyName);
        $(stockName).append(stockLink);

        $(stockPrice).html(stockData.CurrentPrice.toFixed(2));

        $(stockChange).html(stockData.ChangePrice.toFixed(2));

        $(stockRem).attr("id", stockData.CompanyName);
        $(stockRem).attr("title", "Remove " + stockData.CompanyName);
        $(stockRem).addClass("remove");
        $(stockRem).attr("href", "");
        $(stockRem).html("X");
        $(stockRem).click(function () {
            FreshFace.removeStock(stockData.CompanyName);
        });
        $(stockExtra).append(stockRem);

        $(stockRow).append(stockName);
        $(stockRow).append(stockPrice);
        $(stockRow).append(stockChange);
        $(stockRow).append(stockExtra);

        $("#stocks").append(stockRow);
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

            FreshFace.appendStock(data);
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

$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        console.log("Bottom of page!");
    }
    console.log("Scrolling");
});
console.log("Scrolling");
