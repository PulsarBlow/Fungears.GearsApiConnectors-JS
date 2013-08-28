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
		pubsub = fungears.connectors.pubsub,
		Listener = fungears.connectors.Listener;

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
			expect(notifications.isArray()).toBe(true);
			expect(notifications.length).toBe(1);
			expect(notifications[0].type).toBe(1);
			expect(notifications[0].label).toBe("level_changed");
			expect(notifications[0].levelId).toBe(2);
			expect(notifications[0].previousLevel).toBe(6);
			expect(notifications[0].currentLevel).toBe(7);
		});

	});
	it("Listen test with context switch", function() {
		var listener = new Listener(),
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
		}
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
		});

	});

	it("Listen test with advanced binding and context switch", function() {
		var listener = new Listener(),
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
		$button = $("<button data-fungears='click dblclick: DERFS34D'></button>");
		$("#sandbox").append($button);

		context = new function() {
			this.actionKey = null;
			this.notifications = null;
		}
		
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
			expect(context.notifications.isArray()).toBe(true);
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
		$button = $("<button id='#button'></button>");
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
});
