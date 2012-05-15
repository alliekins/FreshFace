

function BFCChart(chartID, pubid, w, h) {

    this.width = w;
    this.height = h;
    this.chartID = chartID;
    this.style = "";
    this.bfcChart = null;
    this.cssClass = "";
    bfcGlobal.isFullOnPage = true;
    bfcGlobal.bfcFullCharts.push(this);
    this.initParams = "clientID=" + chartID + ",PubID=" + pubid;
    this.pubID = pubid;
    this.debug = false;
    this.chartLoadedCallbacks = [];
    this.targetElement = null;
    this.userID = 0;
    this.userStorageKey = null;
    this.rememberUserChanges = true;
    this.createCalled = false;
    this.defaultChart;
    this.enableAllExchanges = false;
    this.createChart = function () {
        var ret = "";
        createCalled = true;
        if (typeof this.width == "undefined") { this.width = 400 }
        if (typeof this.height == "undefined") { this.height = 300 }
        if (typeof this.chartID == "undefined") { this.chartID = "bfcChartWidget" }

        if (this.userID != 0) {
            this.initParams += ",UserID=" + this.userID;
        }

        if (this.enableAllExchanges) {
            this.initParams += ", AllExch=true";
        }
        if (this.userStorageKey != null) {
            this.initParams += ",UserStorageKey=" + this.userStorageKey;
        }
        if (this.defaultChart != null) {
            this.initParams += ",DefaultChart=" + this.defaultChart;
        }

        if (this.rememberUserChanges == false) {
            this.initParams += ",RememberUserChanges=false";
        }

        ret += ('<object data="data:application/x-silverlight-2," id="' + this.chartID + '" type="application/x-silverlight-2" width="' + this.width + '" height="' + this.height + '">');

        if (this.isSecure()) {
            ret += ('<param name="source" value="https://www.FreeStockCharts.com/ClientBin/bfcChartWidget3.xap"/>');
        } else {
            ret += ('<param name="source" value="http://www.FreeStockCharts.com/ClientBin/bfcChartWidget3.xap"/>')
        }
        //	ret =('<param name="onerror" value="onSilverlightError" />');
        ret += ('<param name="background" value="#ECF4F6" />');
        ret += ('<param name="minRuntimeVersion" value="2.0.31005.0" />');
        ret += ('<param name="autoUpgrade" value="true" />');
        ret += ('<param name="Windowless" value="true" />');
        ret += ('<param name="enableHtmlAccess" value="true" />');
        ret += ('<param name="initparams" value="' + this.initParams + '" />');
        ret += ('<a href="http://go.microsoft.com/fwlink/?LinkID=124807" style="text-decoration: none;">');
        ret += ('<img src="http://widgets.FreeStockCharts.com/images/nosilverlight.jpg" alt="Get Microsoft Silverlight" style="border-style: none"/>');
        ret += ('</a>');
        ret += ('</object>');
        if (this.targetElement == null) {
            document.writeln(ret);
        } else {
            document.getElementById(this.targetElement).innerHTML = ret;
        }
        this.callInstallTrack();
    }
    this.isSecure = function () {

        return window.location.protocol == 'https:';

    }

    this.callInstallTrack = function () {

        var oScript = document.createElement("script");

        if (this.isSecure()) {
            oScript.src = "https://widgets.FreeStockCharts.com/ScriptInstalled.ashx?pubid=" + this.pubID + "&widget=interactive&url=" + escape(window.location)
        } else {
            oScript.src = "http://widgets.FreeStockCharts.com/ScriptInstalled.ashx?pubid=" + this.pubID + "&widget=interactive&url=" + escape(window.location)
        }
        //oScript.src = "/ScriptInstalled.ashx?pubid=" + this.pubID + "&widget=hover&url=" + escape(window.location)

        //oScript.src = "/symbols.ashx?callback=BFC_Parse&text=" + text;
        document.body.appendChild(oScript);

    }
    this.createChartWithParams = function (initParams) {
        this.initParams += "," + initParams;
        this.createChart();
    }
    this.addLoadedHandler = function (target) {
        this.chartLoadedCallbacks.push(target);
    }
    this.alert = function (txt) {
        if (this.debug) alert(txt);
    }
    this.Loaded = function () {
        //   this.alert("Control Loaded")
        this.bfcChart = document.getElementById(this.chartID);
        if (this.chartLoadedCallbacks.length > 0) {
            for (var i = 0; i < this.chartLoadedCallbacks.length; i++) {
                eval(this.chartLoadedCallbacks[i]);
            }
            this.chartLoadedCallbacks = [];
        }
    }
    //    this.pubID_set = function(value) {
    //     this.setStringProperty("PubID", value);
    //    }


    this.clearChartMarkers = function () {
        try {
            this.bfcChart.Content.bfcChartWidget.clearChartMarkers();
        } catch (e) {
        }
    }
    this.addImageChartMarker = function (aDate, aURL, Value, offsetDir, offsetAmount, Opacity, ToolTip) {
        try {
            this.bfcChart.Content.bfcChartWidget.addImageChartMarker(aDate, aURL, Value, offsetDir, offsetAmount, Opacity, ToolTip);
        } catch (e) {
        }
    }
    this.addTextChartMarker = function (aDate, text, Value, offsetDir, offsetAmount, Opacity, ToolTip, fontSize) {
        try {
            this.bfcChart.Content.bfcChartWidget.addImageTextMarker(aDate, text, Value, offsetDir, offsetAmount, Opacity, ToolTip, fontSize);
        } catch (e) {
            alert(e.toString());
        }
    }
    this.pubID_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.PubID;
        } catch (e) {
        }
    }

    this.setControlValue = function (name, value) {
        try {
            var codeToRun = "this.bfcChart.Content.bfcChartWidget." + name + " = " + value + "";
            // alert(codeToRun);
            eval(codeToRun);
        } catch (err) { }
    }
    this.callStringFunction = function (name, value) {
        try {
            var codeToRun = "this.bfcChart.Content.bfcChartWidget." + name + "('" + value + "')";
            eval(codeToRun);
        } catch (err) { }
    }

    this.setStringProperty = function (name, value) {
        try {
            var codeToRun = "this.bfcChart.Content.bfcChartWidget." + name + " = '" + value + "'";
            eval(codeToRun);
        } catch (err) { }
    }
    //    this.getControlValue = function(name) {
    //        var result
    //        var codeToRun = "this.bfcChart.Content.bfcChartWidget." + name + "()";
    //        alert(codeToRun);
    //        result = eval(codeToRun);
    //        alert(result);
    //        return result

    //    }

    this.saveChartTemplate = function () {
        try {
            var ret = this.bfcChart.Content.bfcChartWidget.saveChartTemplate();
            return ret
        } catch (e) {
        }
    }
    this.loadChartTemplate = function (template) {
        try {
            this.bfcChart.Content.bfcChartWidget.loadChartTemplate(template);
        } catch (e) {
        }
    }
    this.changeSymbol = function (sym) {
        this.callStringFunction("changeSymbol", sym);
    }

    this.timeFrame_set = function (tf) {
        this.setStringProperty("ChartTimeFrame", tf);
    }
    this.showTimeSpan_set = function (tf) {
        this.setStringProperty("ShowTimeSpanButtons", tf);
    }
    this.topColor_set = function (tf) {
        this.setStringProperty("ChartTopColor", tf);
    }
    this.bottomColor_set = function (tf) {
        this.setStringProperty("ChartBottomColor", tf);
    }
    this.topColor_get = function () {
        return this.bfcChart.Content.bfcChartWidget.ChartTopColor;
    }
    this.bottomColor_get = function () {
        return this.bfcChart.Content.bfcChartWidget.ChartBottomColor;
    }


    this.timeFrame_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.ChartTimeFrame;
        } catch (e) { }
    }
    // 
    //    this.userID_set = function(value) {
    //        this.setControlValue("UserId", value);
    //    }
    //    this.userID_get = function() {
    //        try {
    //            return this.bfcChart.Content.bfcChartWidget.UserID;
    //        } catch (e) {
    //        }
    //    }
    //    this.chartTemplate_set = function(value) {
    //     this.setStringProperty("ChartTemplate", value);
    //    }
    //    this.chartTemplate_get = function(value) {
    //        try {
    //            return this.bfcChart.Content.bfcChartWidget.ChartTemplate;
    //        } catch (e) {
    //        }

    //    }

    this.rememberUserChanges_set = function (value) {
        if (createCalled) {
            this.setControlValue("RemeberUserChanges", value);
        } else {
            this.rememberUserChanges = value;
        }
    }

    this.rememberUserChanges_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.RemeberUserChanges;
        } catch (e) {
        }
    }

    //
    //    this.userStorageKey_set = function(value) {
    //        this.setStringProperty("UserStorageKey", value);
    //    }
    //    this.userStorageKey_get = function() {
    //      //  return this.getControlValue("UserStorageKey");
    //        try {
    //            return this.bfcChart.Content.bfcChartWidget.UserStorageKey;
    //        } catch (e) {
    //        }
    //    }

    this.bgColor_set = function (value) {
        this.setStringProperty("ChartBackgroundColor", value);
    }
    this.bgColor_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.ChartBackgroundColor;
        } catch (e) {
        }
    }
    this.showZoomScroll_set = function (value) {
        this.setControlValue("ZoomScrollVisible", value);
    }
    this.showZoomScroll_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.ZoomScrollVisible;
        } catch (e) {
        }

    }
    this.numBarsVis_set = function (value) {
        this.setControlValue("NumberOfBars", value);
    }
    this.numBarsVis_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.NumberOfBars;
        } catch (e) {
        }
        //          return this.getControlValue("NumberOfBars");
    }

    this.fixedEndDate_set = function (value) {
        this.setControlValue("FixedEndDate", value);
    }
    this.fixedEndDate_get = function () {
        //return this.getControlValue("FixedEndDate");
        try {
            return this.bfcChart.Content.bfcChartWidget.FixedEndDate;
        } catch (e) {
        }
    }
    //
    this.watermarkOpacity_set = function (value) {
        this.setControlValue("WatermarkOpacity", value / 100);
    }
    this.watermarkOpacity_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.WatermarkOpacity * 100;
        } catch (e) {
        }
        //          return this.getControlValue("WaterMarkOpacity") * 100;
    }

    //
    this.showValueScale_set = function (value) {
        this.setControlValue("ValueScaleVisible", value);
    }
    this.showValueScale_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.ValueScaleVisible;
        } catch (e) {
        }
    }
    //
    this.showDateScale_set = function (value) {
        this.setControlValue("DateScaleVisible", value);
    }
    this.showDateScale_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.DateScaleVisible;
        } catch (e) { }
    }

    this.valueScaleFontSize_set = function (value) {
        this.setControlValue("ValueScaleFontSize", value);
    }
    this.valueScaleFontSize_get = function () {
        //   return this.getControlValue("ValueScaleFontSize");
        try {
            return this.bfcChart.Content.bfcChartWidget.ValueScaleFontSize;
        } catch (e) { }

    }
    this.dateScaleFontSize_set = function (value) {
        this.setControlValue("DateScaleFontSize", value);
    }
    this.dateScaleFontSize_get = function () {
        //    return this.getControlValue("DateScaleFontSize");
        try {
            return this.bfcChart.Content.bfcChartWidget.DateScaleFontSize;
        } catch (e) { }

    }
    this.showToolBar_set = function (value) {
        //this.setControlValue("ShowToolBar", value);
        // try {
        return this.bfcChart.Content.bfcChartWidget.ShowToolBar = value;
        //} catch (e) { } 
    }
    this.showToolBar_get = function (value) {
        try {
            return this.bfcChart.Content.bfcChartWidget.ShowToolBar;
        } catch (e) { }
        //    return this.getControlValue("ShowToolBar");
    }
    this.showChangeSymbol_set = function (value) {
        this.setControlValue("ShowChangeSymbol", value);
    }
    this.showChangeSymbol_get = function () {
        //    return this.getControlValue("ShowSymbolChange");
        try {
            return this.bfcChart.Content.bfcChartWidget.ShowChangeSymbol;
        } catch (e) { }
    }
    this.showChangeTimeFrame_set = function (value) {
        this.setControlValue("ShowChangeTimeFrame", value);
    }
    this.showChangeTimeFrame_get = function () {
        //     return this.getControlValue("ShowChangeTimeFrame");
        try {
            return this.bfcChart.Content.bfcChartWidget.ShowChangeTimeFrame;
        } catch (e) { }
    }
    //
    this.showComparison_set = function (value) {
        this.setControlValue("ShowComparison", value);
    }
    this.showComparison_get = function () {
        //     return this.getControlValue("ShowComparison");
        try {
            return this.bfcChart.Content.bfcChartWidget.ShowComparison;
        } catch (e) { }
    }
    this.showChangeIndicator_set = function (value) {
        this.setControlValue("ShowChangeIndicator", value);
    }
    this.showChangeIndicator_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.ShowChangeIndicator;
        } catch (e) { }

        //      return this.getControlValue("ShowChangeIndicator", value);
    }

    //
    this.showChangeChartSettings_set = function (value) {
        this.setControlValue("ShowChangeChartSettings", value);
    }
    this.showChangeChartSettings_get = function () {
        try {
            return this.bfcChart.Content.bfcChartWidget.ShowChangeChartSettings;
        } catch (e) { }
        //       return this.getControlValue("ShowChangeChartSettings");

    }

}
    