describe("Testing Api module", function() {
    var Api = fungears.connectors.Api,
        apiOptions = {
            apiUrl: '/api',
            authUrl: '/auth',
            gameId: 1,
            oauth2: {
            grant_type: 'client_credentials',
                client_id: "CLIENT_ID",
                client_secret: "CLIENT_SECRET",
                scope: "/api"
            }
        };

    it("Prefilter Auth test", function() {
        var flag, result,
            isAuthenticated = false,
            gameApi = new Api();

        isAuthenticated = false;
        $.mockjax(function(settings) {
            if(settings.url.match(/\/auth/)) {
                isAuthenticated = true;
                return {
                    responseTime: 0,
                    contentType: 'text/json',
                    responseText: {"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJodHRwczovL2FwaS5mdW5nZWFycy5jb20vIiwiaXNzIjoiaHR0cHM6Ly9mdW5nZWFycy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0LyIsIm5iZiI6MTM3NzI2MTU5OSwiZXhwIjoxMzc3MjYxNjU5LCJuYW1laWQiOiJmdW5nZWFycy9wdWJsaWMiLCJpZGVudGl0eXByb3ZpZGVyIjoiaHR0cHM6Ly9mdW5nZWFycy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0LyJ9.kpA00i0krPV80BderH97q8B00yviexMocOoidtUD0Y8","expires_in":"59","scope":"https://api.fungears.com/","token_type":"urn:ietf:params:oauth:token-type:jwt"}
                }
            }
            else if(settings.url.match(/\/api/)) {
                if(isAuthenticated) {
                    return {
                        responseTime: 0,
                        contentType: 'text/json',
                        responseText: [{"type":1,"label":"level_changed","levelId":2,"previousLevel":6,"currentLevel":7,"diff":1},{"type":4,"label":"points_received","itemId":2,"itemType":4,"quantity":10.0},{"type":3,"label":"currency_received","itemId":2,"itemType":4,"quantity":1.0},{"type":5,"label":"good_received","itemId":1,"itemType":4,"quantity":1.0}]
                    }
                }
                return {
                    responseText: {"message":"Authorization has been denied for this request."},
                    status: 401,
                    responseTime: 0,
                    contentType: 'text/json'
                }
            }
        });

        runs(function() {
            flag = false;
            result = null;
            gameApi.init(apiOptions);
            gameApi.postEvent({"gamerId":1,"gamerApiKey":"1234","Location":"","actionId":5}).done(function(data){
                result = data;
                flag = true;
            }).fail(function() {
                    flag = false;
                });
        });

        waitsFor(function() {
            return flag;
        }, "Ajax call failed", 200);

        runs(function() {
            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(result.id).toBe(result.id);
            expect(result.label).toBe(result.label);
            $.mockjaxClear();
        });
    });

});