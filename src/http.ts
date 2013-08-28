///<reference path="_references.ts" />

module fungears.connectors {
    var httpMethods = {
        GET:'GET',
        POST:'POST'
    }
    var contentTypes = {
        JSON: "application/json; charset=utf-8",
        FORM_URLENCODED: "application/x-www-form-urlencoded; charset=utf-8"
    }

    function executeAjaxRequest(url: string, httpMethod: string, data: any, contentType: string = contentTypes.JSON): JQueryPromise<any> {
        system.guard.argumentNotNullOrEmpty(url, "url");
        system.guard.argumentNotNullOrEmpty(httpMethod, "httpMethod");
        system.log("Executing ajax call ({0} : {1})".format(httpMethod, url));

        return $.ajax(url, {
            type: httpMethod.toUpperCase(),
            data: contentType === contentTypes.FORM_URLENCODED ? data : JSON.stringify(data),
            contentType: contentType,
            dataType: "json",
            processData: false
        });
    }
    export var http = {
        get: function (url, query?): JQueryPromise<any> {
            return executeAjaxRequest(url, httpMethods.GET, query);
        },
        postJson: function(url: string, data: Object): JQueryPromise<any> {
            system.guard.argumentNotNull(data, "data");
            return executeAjaxRequest(url, httpMethods.POST, data);
        },
        postForm: function(url: string, data: Object) : JQueryPromise<any> {
            system.guard.argumentNotNull(data, "data");
            return executeAjaxRequest(url, httpMethods.POST, data, contentTypes.FORM_URLENCODED);
        }
    };
}