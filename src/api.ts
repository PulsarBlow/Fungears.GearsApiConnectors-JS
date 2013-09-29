///<reference path="_references.ts" />
module fungears.connectors {
    var defaults: IApiOptions = {
            apiUrl: 'https://gears.fungears.io/games',
            authUrl: null,
            gameId: null,
            oauth2: {
                grant_type: 'client_credentials',
                client_id: null,
                client_secret: null,
                scope: null
            }
        },
        settings: IApiOptions = {},
        accessToken:string = null;

    export class Api {
        constructor() {

        }
        public init(options?: IApiOptions) {
            settings = <IApiOptions>($.extend(true, {}, defaults, options));
            this.setPrefilter();
        }
        public postEvent(gameEvent: IGameEvent) {
            return http.postJson("{0}/games/{1}/events".format(settings.apiUrl, settings.gameId), <any>gameEvent);
        }
        private refreshAccessToken() {
            return http.postForm(settings.authUrl, settings.oauth2).done((json) => {
                accessToken = json.access_token;
            });
        }
        private setPrefilter() {
            $.ajaxPrefilter((options, originalOptions: JQueryAjaxSettings, jqXHR: JQueryXHR) => {
                // Apply Authorization header and retry process to API calls only
                if(options.url.startsWith(settings.apiUrl)) {
                    if (accessToken) {
                        jqXHR.setRequestHeader("Authorization", "Bearer " + accessToken);
                    }

                    // Don't infinitely recurse
                    originalOptions._retry = isNaN(originalOptions._retry)
                        ? 1
                        : originalOptions._retry - 1;
                }

                // save the original error callback for later
                if (originalOptions.error)
                    originalOptions._error = originalOptions.error;

                // overwrite *current request* error callback
                options.error = $.noop();

                // setup our own deferred object to also support promises that are only invoked
                // once all of the retry attempts have been exhausted
                var dfd = $.Deferred();
                jqXHR.done(dfd.resolve);

                // if the request fails, do something else yet still resolve
                jqXHR.fail(() => {
                    var args = Array.prototype.slice.call(arguments);

                    if ((jqXHR.status === 401 ||
                        // IE10 bug hack (IE10 returns 0 instead of 401)
                        // http://stackoverflow.com/questions/16081267/xmlhttprequest-status-0-instead-of-401-in-ie-10
                        // https://connect.microsoft.com/IE/feedback/details/802602/ie-10-on-win8-does-not-assign-the-correct-httpstatus-to-xmlhttprequest-when-the-result-is-401
                        jqXHR.status === 0)
                        && originalOptions._retry > 0) {

                        // refresh the oauth credentials for the next attempt(s)
                        // (will be stored and returned by accessToken variable)
                        this.refreshAccessToken().done(function () {
                            // retry with our modified header
                            $.ajax(originalOptions).then(dfd.resolve, dfd.reject);
                        }).fail(function() {
                                throw new Error("Unable to refresh access token");
                            });

                    } else {
                        // add our _error callback to our promise object
                        if (originalOptions._error)
                            dfd.fail(originalOptions._error);
                        dfd.rejectWith(jqXHR, args);
                    }
                });

                // NOW override the jqXHR's promise functions with our deferred
                return dfd.promise(jqXHR);
            });
        }
    }
}