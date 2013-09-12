describe("Testing listener module", function() {
	fungears.connectors.system.debug(true);
	var options = {
			apiOptions: {
				gameId: 1,
				apiUrl: '/api',
				authUrl: '/auth',
				oauth2: {
					client_id: 'clientId',
					client_secret: 'clientSecret',
					scope: 'scope'
				}
			},
			gamerId: 1,
			gamerApiKey: 'ABCEDEDEDEDEDEDEDEDEDED'
		},
		pubSub = fungears.connectors.pubSub,
		Listener = fungears.connectors.Listener;

    afterEach(function() {
        pubSub.reset();
        $.mockjaxClear();
    });

	it("Testing Settings validation - Success", function() {
		var listener = new Listener(),
			wrapper = function() {
				listener.init(options)
			};
		expect(wrapper).not.toThrow();
		expect(listener.settings.apiOptions.apiUrl).toBe('/api');
		expect(listener.settings.apiOptions.authUrl).toBe('/auth');
		expect(listener.settings.apiOptions.oauth2.client_id).toBe('clientId');
		expect(listener.settings.apiOptions.oauth2.client_secret).toBe('clientSecret');
		expect(listener.settings.apiOptions.oauth2.scope).toBe('scope');
		expect(listener.settings.apiOptions.gameId).toBe(1);
		expect(listener.settings.gamerId).toBe(1);
		expect(listener.settings.gamerApiKey).toBe('ABCEDEDEDEDEDEDEDEDEDED');
	});
	it("Testing Settings validation - Throw 1", function() {
		var listener = new Listener(),
			opts = $.extend(true, {}, options, {
				apiOptions: null,
				gamerId: 1,
				gamerApiKey: 'ABCEDEDEDEDEDEDEDEDEDED'
			}),
			wrapper = function() {
				listener.init(opts)
			};
		expect(wrapper).toThrow();

	});
	it("Testing Settings validation - Throw 2", function() {
		var listener = new Listener(),
			opts = $.extend(true, {}, options, {
				apiOptions: null,
				gamerId: 1,
				gamerApiKey: 'ABCEDEDEDEDEDEDEDEDEDED'
			}),
			wrapper = function() {
				listener.init(opts)
			};
		expect(wrapper).toThrow();

	});
	it("Testing Settings validation - Throw 3", function() {
		var listener = new Listener(),
			opts = $.extend(true, {}, options, {
				apiOptions: null,
				gamerId: 1,
				gamerApiKey: 'ABCEDEDEDEDEDEDEDEDEDED'
			}),
			wrapper = function() {
				listener.init(opts)
			};

		expect(wrapper).toThrow();

	});

    it("Listen test", function() {
		var listener = new Listener(),
            $button,
			listening,
			flag1 = false, flag2 = false,
			actionKey, notifications;

		$.mockjax({
			url: "/api/*",
			responseTime: 0,
			contentType: 'text/json',
			responseText: [{"type":1,"label":"level_changed","levelId":2,"previousLevel":6,"currentLevel":7,"diff":1}]
		});

		// DOM Fixtures
		setFixtures(sandbox());
		$button = $("<button data-fungears='click: DERFS34D'></button>");
		$("#sandbox").append($button);

		listener.onGameAction(function(eventArgs) {
			actionKey = eventArgs;
			flag1 = true;
		});
		listener.onGameNotification(function(eventArgs) {
			notifications = eventArgs;
			flag2 = true;
		});
		listener.init(options);
		listening = listener.listen();
		expect(listening).toBe(true);		
		

		runs(function() {
			$button.trigger('click');
		});

		waitsFor(function() {
			return flag1;
		}, "Failed to receive gameAction event", 100);
		waitsFor(function() {
			return flag2;
		}, "Failed to receive gameNotification event", 100);

		runs(function() {
			expect(actionKey).toBe('DERFS34D');
			expect(notifications).not.toBeFalsy();
			expect(Array.isArray(notifications)).toBe(true);
			expect(notifications.length).toBe(1);
			expect(notifications[0].type).toBe(1);
			expect(notifications[0].label).toBe("level_changed");
			expect(notifications[0].levelId).toBe(2);
			expect(notifications[0].previousLevel).toBe(6);
			expect(notifications[0].currentLevel).toBe(7);
            pubSub.reset();
		});


	});
	it("Listen test with context switch", function() {
		var listener = new Listener(),
            $button,
			listening,
			flag1 = false;

		$.mockjax({
			url: "/api/*",
			responseTime: 0,
			contentType: 'text/json',
			responseText: [{"type":1,"label":"level_changed","levelId":2,"previousLevel":6,"currentLevel":7,"diff":1}]
		});

		// DOM Fixtures
		setFixtures(sandbox());
		$button = $("<button data-fungears='click: DERFS34D'></button>");
		$("#sandbox").append($button);

		var context = new function() {
			this.actionKey = null;
		};
		listener.onGameAction(function(eventArgs) {
			this.actionKey = eventArgs;
			flag1 = true;
		}, context);
		listener.init(options);
		listening = listener.listen();
		expect(listening).toBe(true);

		runs(function() {
			$button.trigger('click');
		});

		waitsFor(function() {
			return flag1;
		}, "Failed to receive gameAction event", 100);

		runs(function() {
			expect(context.actionKey).toBe('DERFS34D');
            pubSub.reset();
		});

	});
	it("Listen test with advanced binding and context switch", function() {
		var listener = new Listener(),
            $button,
			listening,
			flag1 = false,
			flag2 = false,
			context;

		$.mockjax({
			url: "/api/*",
			responseTime: 0,
			contentType: 'text/json',
			responseText: [{"type":1,"label":"level_changed","levelId":2,"previousLevel":6,"currentLevel":7}]
		});

		// DOM Fixtures
		setFixtures(sandbox());
		$button = $('<button data-fungears="click dblclick: DERFS34D"></button>');
		$("#sandbox").append($button);

		context = new function() {
			this.actionKey = null;
			this.notifications = null;
		};
		
		listener.onGameAction(function(eventArgs) {
			this.actionKey = eventArgs;
			flag1 = true;
		}, context);
		listener.onGameNotification(function(eventArgs) {
			this.notifications = eventArgs;	
			flag2 = true;
		}, context);

		listener.init(options);
		listening = listener.listen();
		expect(listening).toBe(true);
		
		runs(function() {
			$button.trigger('dblclick');
		});
		waitsFor(function() {
			return flag1;
		}, "Failed to receive gameAction event", 100);

		waitsFor(function() {
			return flag2;
		}, "Failed to receive gameNotification event", 100);

		runs(function() {
			expect(context.actionKey).toBe('DERFS34D');
			expect(context.notifications).not.toBeFalsy();
			expect(Array.isArray(context.notifications)).toBe(true);
			expect(context.notifications.length).toBe(1);
			expect(context.notifications[0].type).toBe(1);
			expect(context.notifications[0].label).toBe("level_changed");
			expect(context.notifications[0].levelId).toBe(2);
			expect(context.notifications[0].previousLevel).toBe(6);
			expect(context.notifications[0].currentLevel).toBe(7);
		});

	});
	it("ListenTo test", function() {
		var listener = new Listener(),
            $button,
			listening,
			flag = false,
			actionKey;

		$.mockjax({
			url: "/auth/*"
		});
		$.mockjax({
			url: "/api/*"
		});

		// DOM Fixtures
		setFixtures(sandbox());
		$button = $('<button id="#button"></button>');
		$("#sandbox").append($button);

		listener.onGameAction(function(eventArgs) {
			actionKey = eventArgs;
			flag = true;
		});
		listener.init(options);
		listener.listenTo($button, 'click', 'DERFS34D');

		runs(function() {
			$button.trigger('click');
		});
		waitsFor(function() {
			return flag;
		}, "Failed to received event", 100);

		runs(function() {
			expect(actionKey).toBe('DERFS34D');
		});
	});

    it("DelegatedListen test", function() {
        var listener = new Listener(),
            $button,
            listening,
            flag1 = false, flag2 = false,
            actionKey, notifications;

        $.mockjax({
            url: "/api/*",
            responseTime: 0,
            contentType: 'text/json',
            responseText: [{"type":1,"label":"level_changed","levelId":2,"previousLevel":6,"currentLevel":7,"diff":1}]
        });

        // DOM Fixtures
        setFixtures(sandbox());
        $button = $("<button data-fungearsABCDE='click: DERFS34D'></button>");
        $("#sandbox").append($button);

        listener.onGameAction(function(eventArgs) {
            actionKey = eventArgs;
            flag1 = true;
        });
        listener.onGameNotification(function(eventArgs) {
            notifications = eventArgs;
            flag2 = true;
        });

        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungearsABCDE'});
        listener.init(optionOverrides);
        listening = listener.delegatedListen();
        expect(listening).toBe(true);


        runs(function() {
            $button.trigger('click');
        });

        waitsFor(function() {
            return flag1;
        }, "Failed to receive gameAction event", 100);
        waitsFor(function() {
            return flag2;
        }, "Failed to receive gameNotification event", 100);

        runs(function() {
            expect(actionKey).toBe('DERFS34D');
            expect(notifications).not.toBeFalsy();
            expect(Array.isArray(notifications)).toBe(true);
            expect(notifications.length).toBe(1);
            expect(notifications[0].type).toBe(1);
            expect(notifications[0].label).toBe("level_changed");
            expect(notifications[0].levelId).toBe(2);
            expect(notifications[0].previousLevel).toBe(6);
            expect(notifications[0].currentLevel).toBe(7);
        });

    });
    it("DelegatedListen test with advanced evenTypes filter", function() {
        var listener = new Listener(),
            $button,
            listening,
            flag1 = false, flag2 = false,
            actionKey, notifications;

        $.mockjax({
            url: "/api/*",
            responseTime: 0,
            contentType: 'text/json',
            responseText: [{"type":1,"label":"level_changed","levelId":2,"previousLevel":6,"currentLevel":7,"diff":1}]
        });

        // DOM Fixtures
        setFixtures(sandbox());
        $button = $("<button data-fungears123='dblClick: DERFS34D'></button>"); // Notice the case 'C' error. This shouldn't be a prob.
        $("#sandbox").append($button);

        listener.onGameAction(function(eventArgs) {
            actionKey = eventArgs;
            flag1 = true;
        });
        listener.onGameNotification(function(eventArgs) {
            notifications = eventArgs;
            flag2 = true;
        });

        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click dblclick', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungears123'});
        listener.init(optionOverrides);
        listening = listener.delegatedListen();
        expect(listening).toBe(true);


        runs(function() {
            $button.trigger('click');
        });

        waitsFor(function() {
            return flag1;
        }, "Failed to receive gameAction event", 100);
        waitsFor(function() {
            return flag2;
        }, "Failed to receive gameNotification event", 100);

        runs(function() {
            expect(actionKey).toBe('DERFS34D');
            expect(notifications).not.toBeFalsy();
            expect(Array.isArray(notifications)).toBe(true);
            expect(notifications.length).toBe(1);
            expect(notifications[0].type).toBe(1);
            expect(notifications[0].label).toBe("level_changed");
            expect(notifications[0].levelId).toBe(2);
            expect(notifications[0].previousLevel).toBe(6);
            expect(notifications[0].currentLevel).toBe(7);
        });

    });

    it("OnLevelChanged test", function() {
        var listener = new Listener(),
            $button,
            flag = false,
            notification;

        $.mockjax({
            url: "/api/*",
            responseTime: 0,
            contentType: 'text/json',
            responseText: [{"type":1}]
        });

        // DOM Fixtures
        setFixtures(sandbox());
        $button = $("<button data-fungears='click: DERFS34D'></button>");
        $("#sandbox").append($button);

        listener.onLevelChanged(function(eventArgs) {
            notification = eventArgs;
            flag = true;
        });

        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungears'});
        listener.init(optionOverrides);
        listener.delegatedListen();

        runs(function() {
            $button.trigger('click');
        });

        waitsFor(function() {
            return flag;
        }, "Failed to receive event", 100);

        runs(function() {
            expect(notification).not.toBeFalsy();
            expect(Array.isArray(notification)).toBe(false);
            expect(notification.type).toBe(1);
        });
    });
    it("OnAchievementReceived test", function() {
        var listener = new Listener(),
            $button,
            flag = false,
            notification;

        $.mockjax({
            url: "/api/*",
            responseTime: 0,
            contentType: 'text/json',
            responseText: [{"type":2}]
        });

        // DOM Fixtures
        setFixtures(sandbox());
        $button = $("<button data-fungears='click: DERFS34D'></button>");
        $("#sandbox").append($button);

        listener.onAchievementReceived(function(eventArgs) {
            notification = eventArgs;
            flag = true;
        });

        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungears'});
        listener.init(optionOverrides);
        listener.delegatedListen();

        runs(function() {
            $button.trigger('click');
        });

        waitsFor(function() {
            return flag;
        }, "Failed to receive event", 100);

        runs(function() {
            expect(notification).not.toBeFalsy();
            expect(Array.isArray(notification)).toBe(false);
            expect(notification.type).toBe(2);
        });
    });
    it("OnCurrencyReceived test", function() {
        var listener = new Listener(),
            $button,
            flag = false,
            notification;

        $.mockjax({
            url: "/api/*",
            responseTime: 0,
            contentType: 'text/json',
            responseText: [{"type":3}]
        });

        // DOM Fixtures
        setFixtures(sandbox());
        $button = $("<button data-fungears='click: DERFS34D'></button>");
        $("#sandbox").append($button);

        listener.onCurrencyReceived(function(eventArgs) {
            notification = eventArgs;
            flag = true;
        });

        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungears'});
        listener.init(optionOverrides);
        listener.delegatedListen();

        runs(function() {
            $button.trigger('click');
        });

        waitsFor(function() {
            return flag;
        }, "Failed to receive event", 100);

        runs(function() {
            expect(notification).not.toBeFalsy();
            expect(Array.isArray(notification)).toBe(false);
            expect(notification.type).toBe(3);
        });
    });
    it("OnPointReceived test", function() {
        var listener = new Listener(),
            $button,
            flag = false,
            notification;

        $.mockjax({
            url: "/api/*",
            responseTime: 0,
            contentType: 'text/json',
            responseText: [{"type":4}]
        });

        // DOM Fixtures
        setFixtures(sandbox());
        $button = $("<button data-fungears='click: DERFS34D'></button>");
        $("#sandbox").append($button);

        listener.onPointReceived(function(eventArgs) {
            notification = eventArgs;
            flag = true;
        });

        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungears'});
        listener.init(optionOverrides);
        listener.delegatedListen();

        runs(function() {
            $button.trigger('click');
        });

        waitsFor(function() {
            return flag;
        }, "Failed to receive event", 100);

        runs(function() {
            expect(notification).not.toBeFalsy();
            expect(Array.isArray(notification)).toBe(false);
            expect(notification.type).toBe(4);
        });
    });
    it("OnGoodReceived test", function() {
        var listener = new Listener(),
            $button,
            flag = false,
            notification;

        $.mockjax({
            url: "/api/*",
            responseTime: 0,
            contentType: 'text/json',
            responseText: [{"type":5}]
        });

        // DOM Fixtures
        setFixtures(sandbox());
        $button = $("<button data-fungears='click: DERFS34D'></button>");
        $("#sandbox").append($button);

        listener.onGoodReceived(function(eventArgs) {
            notification = eventArgs;
            flag = true;
        });

        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungears'});
        listener.init(optionOverrides);
        listener.delegatedListen();

        runs(function() {
            $button.trigger('click');
        });

        waitsFor(function() {
            return flag;
        }, "Failed to receive event", 100);

        runs(function() {
            expect(notification).not.toBeFalsy();
            expect(Array.isArray(notification)).toBe(false);
            expect(notification.type).toBe(5);
        });
    });

    it("Dispose test", function() {
        var listener = new Listener();
        var optionOverrides = $.extend(true, {}, options, { eventTypes: 'click', delegatedTarget:'#sandbox', defaultBindingName: 'data-fungearsABCDE'});
        listener.init(optionOverrides);
        listener.dispose();
        expect(listener.disposed).toBe(true);
    });
});
