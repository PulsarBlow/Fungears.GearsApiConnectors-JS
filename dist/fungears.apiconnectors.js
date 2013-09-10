/*! GearsApiConnectorsJS - version: 0.1.3 - revision: 20130910
    A cross-device, cross-platform client framework written in JavaScript and designed to make connecting to our gamification engine easy.
    Author: Fungears <support@fungears.com> (http://fungears.com)
    Repository: https://github.com/Fungears/GearsApiConnectors-JS
    Licence: BSD-3-Clause (http://opensource.org/licenses/BSD-3-Clause) */
var fungears;
(function (fungears) {
    (function (connectors) {
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
            String.prototype.format = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return this.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] !== 'undefined' ? args[number] : match;
                });
            };
        }

        if (!Array.isArray) {
            Array.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === "[object Array]";
            };
        }

        if (!Object.keys) {
            Object.keys = ((function () {
                'use strict';
                var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'), dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ], dontEnumsLength = dontEnums.length;

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
            })());
        }
    })(fungears.connectors || (fungears.connectors = {}));
    var connectors = fungears.connectors;
})(fungears || (fungears = {}));

var fungears;
(function (fungears) {
    (function (connectors) {
        var isDebugging = false, treatAsIE8 = false, noop = function () {
        }, log, logError, guard;

        if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === 'object') {
            try  {
                ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function (method) {
                    console[method] = this.call(console[method], console);
                }, Function.prototype.bind);
            } catch (ex) {
                treatAsIE8 = true;
            }
        }

        log = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            try  {
                if (typeof console !== 'undefined' && typeof console.log === 'function') {
                    if (window.opera) {
                        var i = 0;
                        while (i < args.length) {
                            console.log('Item ' + (i + 1) + ': ' + args[i]);
                            i++;
                        }
                    } else if ((Array.prototype.slice.call(args)).length === 1 && typeof Array.prototype.slice.call(args)[0] === 'string') {
                        console.log((Array.prototype.slice.call(args)).toString());
                    } else {
                        console.log(Array.prototype.slice.call(args));
                    }
                } else if ((!Function.prototype.bind || treatAsIE8) && typeof console !== 'undefined' && typeof console.log === 'object') {
                    Function.prototype.call.call(console.log, console, Array.prototype.slice.call(args));
                }
            } catch (ignore) {
            }
        };

        logError = function (error) {
            throw error;
        };
        guard = {
            argumentNotNull: function (argValue, argName) {
                if (argValue === undefined || argValue === null)
                    throw new Error("ArgumentNull exception : " + argName + " is null");
            },
            argumentNotNullOrEmpty: function (argValue, argName) {
                if (argValue === undefined || argValue === null || argValue === '')
                    throw new Error("ArgumentNull exception : " + argName + " is null or empty");
            },
            argumentIsNumber: function (argValue, argName) {
                if (argValue === undefined || argValue === null || typeof (argValue) !== "number")
                    throw new Error("Argument exception : " + argName + " is not a number");
            },
            argumentIsOptionalNumber: function (argValue, argName) {
                if (argValue !== undefined && (argValue === null || typeof (argValue) !== "number"))
                    throw new Error("Argument exception : " + argName + " is not an optional number");
            },
            argumentIsFunction: function (argValue, argName) {
                if (argValue === undefined || argValue === null || typeof argValue !== 'function')
                    throw new Error("Argument exception : " + argName + " is not a function");
            },
            argumentIsDefined: function (argValue, argName) {
                if (argValue === undefined)
                    throw new Error("Argument exception : " + argName + " is undefined");
            }
        };

        connectors.system = {
            version: '0.1.1',
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
    })(fungears.connectors || (fungears.connectors = {}));
    var connectors = fungears.connectors;
})(fungears || (fungears = {}));

var fungears;
(function (fungears) {
    (function (connectors) {
        var httpMethods = {
            GET: 'GET',
            POST: 'POST'
        };
        var contentTypes = {
            JSON: "application/json; charset=utf-8",
            FORM_URLENCODED: "application/x-www-form-urlencoded; charset=utf-8"
        };

        function executeAjaxRequest(url, httpMethod, data, contentType) {
            if (typeof contentType === "undefined") { contentType = contentTypes.JSON; }
            connectors.system.guard.argumentNotNullOrEmpty(url, "url");
            connectors.system.guard.argumentNotNullOrEmpty(httpMethod, "httpMethod");
            connectors.system.log("Executing ajax call ({0} : {1})".format(httpMethod, url));

            return $.ajax({
                url: url,
                type: httpMethod.toUpperCase(),
                data: contentType === contentTypes.FORM_URLENCODED ? data : JSON.stringify(data),
                contentType: contentType,
                dataType: "json"
            });
        }
        connectors.http = {
            get: function (url, query) {
                return executeAjaxRequest(url, httpMethods.GET, query);
            },
            postJson: function (url, data) {
                connectors.system.guard.argumentNotNull(data, "data");
                return executeAjaxRequest(url, httpMethods.POST, data);
            },
            postForm: function (url, data) {
                connectors.system.guard.argumentNotNull(data, "data");
                return executeAjaxRequest(url, httpMethods.POST, data, contentTypes.FORM_URLENCODED);
            }
        };
    })(fungears.connectors || (fungears.connectors = {}));
    var connectors = fungears.connectors;
})(fungears || (fungears = {}));

var fungears;
(function (fungears) {
    (function (connectors) {
        var EventSubscription = (function () {
            function EventSubscription(subscriptionId, func) {
                this.subscriptionId = subscriptionId;
                this.func = func;
            }
            return EventSubscription;
        })();
        connectors.EventSubscription = EventSubscription;
        var EventAggregator = (function () {
            function EventAggregator() {
                this.subUid = 0;
                this.subscriptions = {};
            }
            EventAggregator.prototype.subscribe = function (event, func) {
                if (!this.subscriptions[event]) {
                    this.subscriptions[event] = [];
                }
                var subscription = new EventSubscription(++this.subUid, func);
                this.subscriptions[event].push(subscription);
                return subscription.subscriptionId;
            };

            EventAggregator.prototype.unsubscribe = function (subscriptionId) {
                var m, i, j;
                for (m in this.subscriptions) {
                    if (this.subscriptions[m]) {
                        for (i = 0, j = this.subscriptions[m].length; i < j; i++) {
                            if (this.subscriptions[m][i].subscriptionId === subscriptionId) {
                                this.subscriptions[m].splice(i, 1);
                                return true;
                            }
                        }
                    }
                }
                return false;
            };

            EventAggregator.prototype.publish = function (event, eventArgs) {
                var _this = this;
                if (!this.subscriptions[event]) {
                    return false;
                }
                setTimeout(function () {
                    var subscribers = _this.subscriptions[event], len = subscribers ? subscribers.length : 0;

                    while (len--) {
                        subscribers[len].func(eventArgs);
                    }
                }, 0);
                return true;
            };

            EventAggregator.prototype.reset = function () {
                this.subUid = 0;
                this.subscriptions = {};
            };
            return EventAggregator;
        })();
        connectors.EventAggregator = EventAggregator;

        var singleton = new EventAggregator();
        connectors.pubSub = {
            events: {
                gameAction: 'fungears:gameAction',
                gameNotification: 'fungears:gameNotification'
            },
            publish: function (event, message) {
                return singleton.publish(event, message);
            },
            subscribe: function (event, func) {
                return singleton.subscribe(event, func);
            },
            unsubscribe: function (subId) {
                return singleton.unsubscribe(subId);
            },
            includesIn: function (targetObject) {
                targetObject.subscribe = singleton.subscribe;
                targetObject.unsubscribe = singleton.unsubscribe;
                targetObject.publish = singleton.publish;
            },
            reset: function () {
                return singleton.reset();
            }
        };
    })(fungears.connectors || (fungears.connectors = {}));
    var connectors = fungears.connectors;
})(fungears || (fungears = {}));

var fungears;
(function (fungears) {
    (function (connectors) {
        var defaultBindingName = "data-fungears";

        function preProcessBinding(bindingString) {
            if (!bindingString)
                return null;
            var str = bindingString.trim();

            if (str.charCodeAt(0) === 123)
                str = str.slice(1, -1);

            var elements = str.split(':');
            if (!elements || elements.length !== 2 || !elements[0] || !elements[1])
                return null;
            var result = {
                eventTypes: elements[0].toLowerCase().trim(),
                actionKey: elements[1].trim()
            };
            return result;
        }

        var BindingProvider = (function () {
            function BindingProvider(bindingName) {
                if (typeof bindingName === "undefined") { bindingName = defaultBindingName; }
                this.bindingName = bindingName || defaultBindingName;
            }
            BindingProvider.prototype.getBinding = function (node) {
                var bindingString = this.getBindingString(node);
                return bindingString ? preProcessBinding(bindingString) : null;
            };
            BindingProvider.prototype.getBindingString = function (node) {
                return node.getAttribute ? node.getAttribute(this.bindingName) : '';
            };
            return BindingProvider;
        })();
        connectors.BindingProvider = BindingProvider;
    })(fungears.connectors || (fungears.connectors = {}));
    var connectors = fungears.connectors;
})(fungears || (fungears = {}));

var fungears;
(function (fungears) {
    (function (connectors) {
        var defaults = {
            apiUrl: 'https://gears.fungears.io/games',
            authUrl: null,
            gameId: null,
            oauth2: {
                grant_type: 'client_credentials',
                client_id: null,
                client_secret: null,
                scope: null
            }
        }, settings = {}, accessToken = null;

        var Api = (function () {
            function Api() {
            }
            Api.prototype.init = function (options) {
                settings = ($.extend(true, {}, defaults, options));
                this.setPrefilter();
            };
            Api.prototype.postEvent = function (gameEvent) {
                return connectors.http.postJson("{0}/games/{1}/events".format(settings.apiUrl, settings.gameId), gameEvent);
            };
            Api.prototype.refreshAccessToken = function () {
                return connectors.http.postForm(settings.authUrl, settings.oauth2).done(function (json) {
                    accessToken = json.access_token;
                });
            };
            Api.prototype.setPrefilter = function () {
                var _this = this;
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    var dfd = $.Deferred();

                    if (options.refreshRequest || (!options.url.startsWith(settings.apiUrl) && options.url !== settings.authUrl)) {
                        return;
                    }

                    if (accessToken) {
                        options.headers = { "Authorization": "Bearer " + accessToken };
                    }

                    connectors.system.log("ApiConnector AjaxPrefilter", options, originalOptions, jqXHR);

                    jqXHR.done(function (data) {
                        dfd.resolve(data);
                    });
                    jqXHR.fail(function () {
                        var args = Array.prototype.slice.call(arguments);
                        if (jqXHR.status === 401) {
                            _this.refreshAccessToken().then(function () {
                                var newOptions = $.extend({}, originalOptions, {
                                    refreshRequest: true,
                                    headers: {
                                        "Authorization": "Bearer " + accessToken
                                    }
                                });
                                $.ajax(newOptions).then(dfd.resolve, dfd.reject);
                            }, function () {
                                dfd.rejectWith(jqXHR, args);
                            });
                        } else {
                            dfd.rejectWith(jqXHR, args);
                        }
                    });

                    return dfd.promise(jqXHR);
                });
            };
            return Api;
        })();
        connectors.Api = Api;
    })(fungears.connectors || (fungears.connectors = {}));
    var connectors = fungears.connectors;
})(fungears || (fungears = {}));

var fungears;
(function (fungears) {
    (function (connectors) {
        var defaults = {
            defaultBindingName: 'data-fungears',
            eventTypes: 'click dblclick',
            delegatedTarget: document,
            gamerId: null,
            gamerApiKey: null,
            apiOptions: {}
        };

        var Listener = (function () {
            function Listener() {
                this.subscriptions = [];
                this.disposed = false;
                this.api = new connectors.Api();
            }
            Listener.prototype.init = function (options) {
                this.settings = ($.extend(true, {}, defaults, options));
                this.validateSettings();
                this.api.init(this.settings.apiOptions);
                this.bindingProvider = new connectors.BindingProvider(this.settings.defaultBindingName);

                this.subscriptions.push(connectors.pubSub.subscribe(connectors.pubSub.events.gameAction, this.handleGameAction.bind(this)));
                this.subscriptions.push(connectors.pubSub.subscribe(connectors.pubSub.events.gameNotification, this.handleGameNotification.bind(this)));
            };

            Listener.prototype.listen = function () {
                var bindingProvider = this.bindingProvider, $targets = $('[' + bindingProvider.bindingName + ']');

                if (!$targets || !$targets.length)
                    return false;
                $targets.each(function (index, element) {
                    var $this = $(this);
                    var binding = bindingProvider.getBinding(this);
                    if (binding) {
                        $this.on(binding.eventTypes, function () {
                            connectors.pubSub.publish(connectors.pubSub.events.gameAction, binding.actionKey);
                        });
                    }
                });
                return true;
            };

            Listener.prototype.delegatedListen = function () {
                var eventTypes = this.settings.eventTypes.toLowerCase(), bindingProvider = this.bindingProvider;
                $(this.settings.delegatedTarget).on(this.settings.eventTypes, '[' + bindingProvider.bindingName + ']', function (event) {
                    if (eventTypes.indexOf(event.type) === -1)
                        return true;
                    var binding = bindingProvider.getBinding(this);
                    connectors.pubSub.publish(fungears.connectors.pubSub.events.gameAction, binding.actionKey);
                    return true;
                });
                return true;
            };

            Listener.prototype.listenTo = function ($obj, eventType, actionKey) {
                if (!$obj || !$obj.length || !eventType)
                    return false;
                $obj.on(eventType, function () {
                    connectors.pubSub.publish(connectors.pubSub.events.gameAction, actionKey);
                });
                return true;
            };

            Listener.prototype.onGameAction = function (callback, context) {
                if (typeof context === "undefined") { context = this; }
                if (!callback || typeof callback !== 'function')
                    return false;
                this.subscriptions.push(connectors.pubSub.subscribe(connectors.pubSub.events.gameAction, callback.bind(context)));
                return true;
            };

            Listener.prototype.onGameNotification = function (callback, context) {
                if (typeof context === "undefined") { context = this; }
                if (!callback || typeof callback !== 'function')
                    return false;
                this.subscriptions.push(connectors.pubSub.subscribe(connectors.pubSub.events.gameNotification, callback.bind(context)));
                return true;
            };

            Listener.prototype.dispose = function () {
                if (this.disposed)
                    return;
                var i = 0;
                for (i; i < this.subscriptions.length; i++) {
                    connectors.pubSub.unsubscribe(this.subscriptions[i]);
                }
                this.subscriptions = [];
                this.api = null;
                this.bindingProvider = null;
                this.disposed = true;
            };

            Listener.prototype.handleGameAction = function (actionKey) {
                connectors.system.log("Handling event", connectors.pubSub.events.gameAction, actionKey);
                this.api.postEvent({
                    gamerId: this.settings.gamerId,
                    gamerApiKey: this.settings.gamerApiKey,
                    actionKey: actionKey
                }).done(function (notification) {
                    connectors.pubSub.publish(connectors.pubSub.events.gameNotification, notification);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    connectors.system.log("Api post event", connectors.pubSub.events.gameAction, jqXHR, textStatus, errorThrown);
                });
            };
            Listener.prototype.handleGameNotification = function (notification) {
                connectors.system.log("Handling event", connectors.pubSub.events.gameNotification, notification);
            };
            Listener.prototype.validateSettings = function () {
                if (!this.settings)
                    this.throwValidationError("null object");
                if (!this.settings.apiOptions)
                    this.throwValidationError("apiOptions is null or undefined");
                if (this.settings.gamerId === undefined || this.settings.gamerId === null)
                    this.throwValidationError("gamerId is null or undefined");
                if (!this.settings.gamerApiKey)
                    this.throwValidationError("gamerApiKey is null or undefined");
            };
            Listener.prototype.throwValidationError = function (message) {
                throw new Error("Listener settings error : {0}".format(message));
            };
            return Listener;
        })();
        connectors.Listener = Listener;
    })(fungears.connectors || (fungears.connectors = {}));
    var connectors = fungears.connectors;
})(fungears || (fungears = {}));
