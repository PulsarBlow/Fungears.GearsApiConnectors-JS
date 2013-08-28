describe("Testing http module", function() {
    var http = fungears.connectors.http;
    it("GET test - Guards", function() {
        var throwWrapper = function() {
            http.get(null);
        };

        expect(throwWrapper).toThrow();
    });

    it("GET test", function(){
        var flag, result, responseText = {
            id: 1,
            label: "Fungears Api Object"
        };

        $.mockjax({
            url: '/api/*',
            contentType: 'text/json',
            responseText: responseText,
            responseTime: 0
        });

        runs(function() {
            flag = false;
            result = null;

            http.get('/api/resource').done(function(data) {
                result = data;
                flag = true;
            }).fail(function() {
                flag = false;
            });
        });

        waitsFor(function() {
           return flag;
        }, "Ajax call failed", 100);

        runs(function() {
            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(result.id).toBe(result.id);
            expect(result.label).toBe(result.label);
            $.mockjaxClear();
        });
    });
    it("POST Json test - Guards", function() {
        expect(function() {
            http.postJson(null, null);
        }).toThrow();
        expect(function() {
            http.postJson('/api/resource', null);
        }).toThrow();
    });
    it("POST Json test", function(){
        var flag, result, responseText = {
            id: 1,
            label: "Fungears Api Object"
        };

        $.mockjax({
            url: '/api/*',
            contentType: 'text/json',
            responseText: responseText,
            responseTime: 0
        });

        runs(function() {
            flag = false;
            result = null;

            http.postJson('/api/resource', responseText).done(function(data) {
                result = data;
                flag = true;
            }).fail(function() {
                flag = false;
            });
        });

        waitsFor(function() {
            return flag;
        }, "Ajax call failed", 100);

        runs(function() {
            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(result.id).toBe(result.id);
            expect(result.label).toBe(result.label);
            $.mockjaxClear();
        });
    });

    it("POST Form test - Guards", function() {
        expect(function() {
            http.postJson(null, null);
        }).toThrow();
        expect(function() {
            http.postJson('/api/resource', null);
        }).toThrow();
    });
    it("POST Form test", function(){
        var flag, result, responseText = {
            id: 1,
            label: "Fungears Api Object"
        };

        $.mockjax({
            url: '/api/*',
            contentType: 'text/json',
            responseText: responseText,
            responseTime: 0
        });

        runs(function() {
            flag = false;
            result = null;

            http.postJson('/api/resource', "var1=123&var2=abc").done(function(data) {
                result = data;
                flag = true;
            }).fail(function() {
                    flag = false;
                });
        });

        waitsFor(function() {
            return flag;
        }, "Ajax call failed", 100);

        runs(function() {
            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(result.id).toBe(result.id);
            expect(result.label).toBe(result.label);
            $.mockjaxClear();
        });
    });

});