///<reference path="_references.ts" />

module fungears.connectors {
    var isDebugging = false,
        treatAsIE8 = false,
        noop = function () {},
        log, logError, guard;

	//see http://patik.com/blog/complete-cross-browser-console-log/
	// Tell IE9 to use its built-in console
	if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === 'object') {
		try {
			['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
				.forEach(function (method) {
					console[method] = this.call(console[method], console);
				}, Function.prototype.bind);
		} catch (ex) {
			treatAsIE8 = true;
		}
	}

    log = function (...args) {
        try {
            // Modern browsers
            if (typeof console !== 'undefined' && typeof console.log === 'function') {
                // Opera 11
                if (window.opera) {
                    var i = 0;
                    while (i < args.length) {
                        console.log('Item ' + (i + 1) + ': ' + args[i]);
                        i++;
                    }
                }
                // All other modern browsers
                else if ((Array.prototype.slice.call(args)).length === 1 && typeof Array.prototype.slice.call(args)[0] === 'string') {
                    console.log((Array.prototype.slice.call(args)).toString());
                } else {
                    console.log(Array.prototype.slice.call(args));
                }
            }
            // IE8
            else if ((!Function.prototype.bind || treatAsIE8) && typeof console !== 'undefined' && typeof console.log === 'object') {
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(args));
            }

            // IE7 and lower, and other old browsers
        } catch (ignore) { }
    };

    logError = function (error) {
        throw error;
    };
    guard = {
        argumentNotNull: function (argValue: any, argName: string) {
            if (argValue === undefined || argValue === null)
                throw new Error("ArgumentNull exception : " + argName + " is null");
        },
        argumentNotNullOrEmpty: function (argValue: string, argName: string) {
            if (argValue === undefined || argValue === null || argValue === '')
                throw new Error("ArgumentNull exception : " + argName + " is null or empty");
        },
        argumentIsNumber: function (argValue: any, argName: string) {
            if (argValue === undefined || argValue === null || typeof (argValue) !== "number")
                throw new Error("Argument exception : " + argName + " is not a number");
        },
        argumentIsOptionalNumber: function (argValue: any, argName: string) {
            if (argValue !== undefined && (argValue === null || typeof (argValue) !== "number"))
                throw new Error("Argument exception : " + argName + " is not an optional number");
        },
        argumentIsFunction: function (argValue: any, argName: string) {
            if (argValue === undefined || argValue === null || typeof argValue !== 'function')
                throw new Error("Argument exception : " + argName + " is not a function");
        },
        argumentIsDefined: function (argValue: any, argName: string) {
            if (argValue === undefined)
                throw new Error("Argument exception : " + argName + " is undefined");
        }
    };

    export var system: ISystem = {
        version: '0.1.3',
        noop: noop,
        log: noop,
        error: noop,
        debug: function (enable) {
            isDebugging = enable;
            if (isDebugging) {
                this.log = log;
                this.error = logError;
                this.log("Fungears ApiConnectors - Debug mode enabled");
            }
            return isDebugging;
        },
        guard: guard
    };

}