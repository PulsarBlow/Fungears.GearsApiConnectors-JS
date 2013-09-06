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
        //private accessToken: string = null;
        //private settings: ApiOptions;

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
                var dfd = $.Deferred();
                // Apply filter only if we call the configured API Url or Authorization Url
                if (options.refreshRequest ||
                    (!options.url.startsWith(settings.apiUrl) && options.url !== settings.authUrl)) {
                    //dfd.resolve();
                    return;// dfd.promise(jqXHR);
                }

                // Set the auth header
                if (accessToken) {
                    options.headers = { "Authorization": "Bearer " + accessToken };
                }

                system.log("ApiConnector AjaxPrefilter", options, originalOptions, jqXHR);

                jqXHR.done((data) => {
                    dfd.resolve(data);
                });
                jqXHR.fail(() => {
                    var args = Array.prototype.slice.call(arguments);
                    if (jqXHR.status === 401) {
                        this.refreshAccessToken().then(function () {
                            var newOptions = $.extend({}, originalOptions, {
                                refreshRequest: true,
                                headers: {
                                    "Authorization": "Bearer " + accessToken // Reset the header with refreshed token
                                }
                            });
                            $.ajax(<JQueryAjaxSettings>newOptions).then(dfd.resolve, dfd.reject);
                        }, function () {
                            dfd.rejectWith(jqXHR, args);
                        });
                    } else {
                        dfd.rejectWith(jqXHR, args);
                    }
                });

                return dfd.promise(jqXHR);
            });
        }
    }
}