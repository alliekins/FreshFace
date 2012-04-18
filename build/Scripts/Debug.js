
// A singleton in JS!
// Close enough, anyway


/**
 * Provides debug functionality for FreshFace project.
 *
 * @class Debug
 * @global
 *
 */
var Debug = {

    debug: true,

    /**
     * Initializes Debug parameter.
     *
     * @method prepare
     *
     */
    prepare: function () {
        // Regex test: does the url contain ?debug=true
        Debug.debug = (/debug=true/i.test(window.location));

        $.ajaxSetup({ cache: false });
    },

    /**
     * Logs a string to the console (if debugging & console exists)
     *
     * @method log
     * @param (String) str the string to print
     *
     */
    log: function (str) {
        if (Debug.debug && typeof console !== "undefined") {
            console.log(str);
        }
    },

    /**
     * Pops up an alert dialog (if debugging)
     *
     * @method alert
     * @param (String) str the string to alert
     *
     */
    alert: function (str) {
        if (Debug.debug) {
            alert(str);
        }
    }

};

Debug.prepare();
