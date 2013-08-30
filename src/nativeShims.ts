/// <reference path="_references.ts" />
module fungears.connectors {

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

	if (typeof String.prototype.startsWith !== 'function') {
		String.prototype.startsWith = function (str) {
			return this.slice(0, str.length) === str;
		};
	}

	if (typeof String.prototype.format !== 'function') {
		String.prototype.format = function (...args) {
			return this.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] !== 'undefined' ? args[number] : match;
			});
		};
	}

	if(!Array.isArray) {
		Array.isArray = function (obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		};
	}

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = (function () {
			'use strict';
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError('Object.keys called on non-object');
				}

				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}
}