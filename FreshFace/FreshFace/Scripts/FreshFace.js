
// A singleton in JS!
// Close enough, anyway


/**
* Global functionality for FreshFace project.
*
* @class FreshFace
* @global
*
*/

var chart;

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
        var index = -1;
        for (var i = 0; i < stocks.length; i++) {
            if (stocks[i].name === name) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            stocks.splice(index, 1);
        }
        localStorage.setItem("MyStocks", JSON.stringify(stocks));


        $("#" + name + "row").remove();
        // $("#stockTable").remove();

    },

    /**
    * Removes the given stock.
    *
    * @method removeStock
    *
    */
    addStock: function (name, shares, price) {
        var stockStr = localStorage.getItem("MyStocks");
        var stocks = JSON.parse(stockStr);

        for (var i = 0; i < stocks.length; i++) {
            if (stocks[i].name === name) {
                stocks.splice(i, 1);
                FreshFace.removeStock(name);
                break;
            }
            $("#" + name + "row").hide();
        }

        if (isNaN(shares)) {
            shares = 0;
        }
        if (isNaN(price)) {
            price = 0;
        }

        stocks.push(FreshFace.createStock(name, shares, price));
        localStorage.setItem("MyStocks", JSON.stringify(stocks));

        $.ajax({
            url: "../Stock/Details/" + name,
            context: { name: name },
            type: 'GET',
            success: function (data) {
                if (data === "") {
                    Debug.log("ERROR: returned data from getting stocks was empty string.");
                    return;
                }
                FreshFace.appendStock(data);
                FreshFace.appendStockTable(data);
            },
            error: function (data) {
                FreshFace.removeStock(name);
                alert("Error: Invalid Stock Name");
            }
        });
    },

    createStock: function (name, shares, price) {
        return {
            name: name,
            shares: shares,
            price: price
        };
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
        $(article).addClass("fb-item-" + post.id);
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
            photo = "<a href=\"" + post.link + "\"><img src=\"" + post.picture + "\"/></a>";
        }

        if (post.link && !(post.picture && (post.type === "photo" || post.type === "video"))) {
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

        var colVal = $(stockRow).css("background-color");
        $(stockRow).hover(function () {
            $(stockRow).css("background-color", "#94D9FF");
        }, function () {
            $(stockRow).css("background-color", colVal);
        });

        $(stockLink).attr("href", "MyStocks#" + stockData.CompanyName);
        $(stockLink).html(stockData.CompanyName);
        $(stockName).append(stockLink);

        $(stockPrice).html(stockData.CurrentPrice.toFixed(2));

        $(stockChange).html(stockData.ChangePrice.toFixed(2));
        if (stockData.ChangePrice.toFixed(2) > 0) {
            $(stockChange).attr("style", "color: green");
        } else if (stockData.ChangePrice.toFixed(2) < 0) {
            $(stockChange).attr("style", "color: red");
        }

        $(stockRow).attr("id", stockData.CompanyName + "row");
        $(stockPrice).attr("id", stockData.CompanyName + "price");
        $(stockChange).attr("id", stockData.CompanyName + "change");
        $(stockRem).attr("id", stockData.CompanyName);
        $(stockRem).attr("title", "Remove " + stockData.CompanyName);
        $(stockRem).addClass("remove");
        $(stockRem).attr("href", "");
        $(stockRem).html("X");
        $(stockRem).click(function () {
            FreshFace.removeStock(stockData.CompanyName, stockRow);
            event.preventDefault();
        });
        $(stockExtra).append(stockRem);

        $(stockRow).append(stockName);
        $(stockRow).append(stockPrice);
        $(stockRow).append(stockChange);
        $(stockRow).append(stockExtra);

        $("#stocks").append(stockRow);
    },

    makeRequest: function (name) {
        //Abort any open requests
        if (this.xhr) { this.xhr.abort(); }
        //Start a new request
        this.xhr = $.ajax({
            data: { symbol: name },
            url: "http://dev.markitondemand.com/Api/Quote/jsonp",
            dataType: "jsonp",
            success: function (data) {
                $("#sname").text(data.Data.Name + " (" + data.Data.Symbol + ")");
                $("#lastprice").text("Last Price: " + data.Data.LastPrice);
                $("#change").text("Change: " + data.Data.Change.toFixed(2));
                $("#changeper").text("Change Percent: " + data.Data.ChangePercent.toFixed(2));
                $("#marketcap").text("Market Cap: " + data.Data.MarketCap);
                $("#changeytd").text("Change YTD: " + data.Data.ChangeYTD);
                $("#high").text("High: " + data.Data.High);
                $("#low").text("Low: " + data.Data.Low);
                $("#open").text("Open: " + data.Data.Open);
            },
            error: function (data) {
                alert("Error ");
            },
            context: this
        });
    },

    appendStockTable: function (stockData) {
        var stockStr = localStorage.getItem("MyStocks");
        var stocks = JSON.parse(stockStr);
        var index = -1;
        for (var i = 0; i < stocks.length; i++) {
            if (stocks[i].name === stockData.CompanyName) {
                index = i;
                break;
            }
        }

        var stockRow = document.createElement("tr");
        var stockName = document.createElement("td");
        var stockLink = document.createElement("a");
        var stockPrice = document.createElement("td");
        var stockChange = document.createElement("td");
        var stockShares = document.createElement("td");
        var stockPaid = document.createElement("td");
        var stockValue = document.createElement("td");
        var stockEdit = document.createElement("a");
        var stockEd = document.createElement("td");
        var stockExtra = document.createElement("td");
        var stockRem = document.createElement("a");

        var colVal = $(stockRow).css("background-color");
        $(stockRow).hover(function () {
            $(stockRow).css("background-color", "#94D9FF");
        }, function () {
            $(stockRow).css("background-color", colVal);
        });

        $(stockLink).attr("href", "#");
        $(stockLink).html(stockData.CompanyName);
        $(stockName).append(stockLink);
        $(stockLink).click(function (event) {
            chart.changeSymbol(stockData.CompanyName);
            FreshFace.makeRequest(stockData.CompanyName);
        });

        $(stockPrice).html(stockData.CurrentPrice.toFixed(2));

        $(stockChange).html(stockData.ChangePrice.toFixed(2));
        $(stockChange).html(netValue);
        if (stockData.ChangePrice.toFixed(2) > 0) {
            $(stockChange).attr("style", "color: green");
        } else if (stockData.ChangePrice.toFixed(2) < 0) {
            $(stockChange).attr("style", "color: red");
        }
        $(stockShares).html(stocks[i].shares);
        $(stockPaid).html(stocks[i].price.toFixed(2));
        var netValue = ((stockData.CurrentPrice.toFixed(2) * stocks[i].shares) -
        (stocks[i].shares * stocks[i].price)).toFixed(2);

        $(stockValue).html(netValue);
        if (netValue > 0) {
            $(stockValue).attr("style", "color: green");
        } else if (netValue < 0) {
            $(stockValue).attr("style", "color: red");
        }

        $(stockRow).attr("id", stockData.CompanyName + "row");
        $(stockPrice).attr("id", stockData.CompanyName + "price");
        $(stockChange).attr("id", stockData.CompanyName + "change");
        $(stockPaid).attr("id", stockData.CompanyName + "paid");
        $(stockShares).attr("id", stockData.CompanyName + "shares");
        $(stockValue).attr("id", stockData.CompanyName + "value");
        $(stockRow).attr("id", stockData.CompanyName + "row");
        $(stockEdit).attr("id", stockData.CompanyName);
        $(stockEdit).attr("title", "Edit " + stockData.CompanyName);
        $(stockEdit).addClass("remove");
        $(stockEdit).attr("href", "#");
        $(stockEdit).attr("data-reveal-id", "editModal");
        $(stockEdit).html("Edit");
        $(stockEdit).click(function (event) {
            $("#esymbol").val(stockData.CompanyName);
            $("#enumShares").val(stocks[i].shares);
            $("#eprice").val(stocks[i].price);
            event.preventDefault();
        });


        $(stockRem).attr("id", stockData.CompanyName);
        $(stockRem).attr("title", "Remove " + stockData.CompanyName);
        $(stockRem).addClass("remove");
        $(stockRem).attr("href", "");
        $(stockRem).html("X");
        $(stockRem).click(function () {
            FreshFace.removeStock(stockData.CompanyName);
            event.preventDefault();
        });
        $(stockExtra).append(stockRem);
        $(stockEd).append(stockEdit);
        $(stockRow).append(stockName);
        $(stockRow).append(stockPrice);
        $(stockRow).append(stockChange);
        $(stockRow).append(stockShares);
        $(stockRow).append(stockPaid);
        $(stockRow).append(stockValue);
        $(stockRow).append(stockEd);
        $(stockRow).append(stockExtra);

        $("#stockTable").append(stockRow);
    },
    
    addEvent: function (eventData) {
        $('#calendar').fullCalendar('renderEvent', eventData, true);
    }


};

$(document).ready(function () {

    // Calendar Initialization
    $("#calendar").fullCalendar({
        editable: false,
        header: {
            left: 'title',
            center: '',
            right: 'next,prev today'
        }
    });

    // Stock Initialization
    var stocks = [];
    if (localStorage.getItem("MyStocks") === null ||
            typeof localStorage.getItem("MyStocks") === "undefined") {
        stocks = [FreshFace.createStock("GOOG", 1, 20.00), FreshFace.createStock("MSFT", 1, 20.00), FreshFace.createStock("AMZN", 1, 20.00)];
        stockStr = JSON.stringify(stocks);
        localStorage.setItem("MyStocks", stockStr);
    } else if (typeof JSON.parse(localStorage.getItem("MyStocks"))[0].shares === "undefined") {
        // If it's using the old version with just stock names, override it with defaults
        stocks = [FreshFace.createStock("GOOG", 1, 20.00), FreshFace.createStock("MSFT", 1, 20.00), FreshFace.createStock("AMZN", 1, 20.00)];
        stockStr = JSON.stringify(stocks);
        localStorage.setItem("MyStocks", stockStr);
    } else {
        var stockStr = localStorage.getItem("MyStocks");
        stocks = JSON.parse(stockStr);
    }

    $("#bfcChart").attr("style", "height: 400px;");

    for (var i = 0; i < stocks.length; i++) {

        var url = "../Stock/Details/" + stocks[i].name;
        $.get("../Stock/Details/" + stocks[i].name, function (data) {
            if (data === "") {
                Debug.log("ERROR: returned data from getting stocks was empty string.");
                return;
            }
            FreshFace.appendStock(data);
            FreshFace.appendStockTable(data);
        });

    }

    // Stocks - AJAX UPDATE
    self.setInterval(function () {
        for (var i = 0; i < stocks.length; i++) {

            var url = "../Stock/Details/" + stocks[i].name;
            $.get("../Stock/Details/" + stocks[i].name, function (data) {
                if (data === "") {
                    Debug.log("ERROR: returned data from getting stocks was empty string.");
                    return;
                }
                $("#" + data.CompanyName + "price").html(data.CurrentPrice.toFixed(2));
                $("#" + data.CompanyName + "change").html(data.ChangePrice.toFixed(2));
                if (data.ChangePrice.toFixed(2) > 0) {
                    $("#" + data.CompanyName + "change").attr("style", "color: green");
                } else if (data.ChangePrice.toFixed(2) < 0) {
                    $("#" + data.CompanyName + "change").attr("style", "color: red");
                }

                var shares = parseFloat($("#" + data.CompanyName + "shares").html());
                var paid = parseFloat($("#" + data.CompanyName + "paid").html());
                var netValue = ((data.CurrentPrice * shares) -
                (shares * paid)).toFixed(2);

                $("#" + data.CompanyName + "value").html(netValue);
                if (netValue > 0) {
                    $("#" + data.CompanyName + "value").attr("style", "color: green");
                } else if (netValue < 0) {
                    $("#" + data.CompanyName + "value").attr("style", "color: red");
                }
            });

        }
    }, 5000);
});