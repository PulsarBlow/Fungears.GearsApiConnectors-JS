describe("EventAggregator module", function() {
	var noop = function() {};
	var EventAggregator = fungears.connectors.EventAggregator;

	it("Subscribe test", function() {
		var topic1 = 'pubsubtest:topic1',
			topic2 = 'pubsubtest:topic1',
			aggregator = new EventAggregator(),
			id1 = aggregator.subscribe(topic1, noop),
			id2 = aggregator.subscribe(topic2, noop);
		expect(id1).not.toBeFalsy();
		expect(id2).not.toBe(id1);
	});

	it("Publish test - Success", function() {
		var flag,
			result,
			aggregator = new EventAggregator(),
			message = "A message",
			topic = 'pubsubtest2:topic1',
			token = aggregator.subscribe(topic, function(eventArgs) {
				flag = true;
				result = eventArgs;
			})

		runs(function() {
			flag = false;
			result = null;
			aggregator.publish(topic, message);
		});

		waitsFor(function() {
			return flag;
		}, "Publish failed", 10);

		runs(function() {
			expect(result).not.toBeUndefined();
			expect(result).not.toBeNull();
			expect(result).toBe(message);
		})
	});

	it("Publish test - Failure", function() {
		var result,
			aggregator = new EventAggregator(),
			topic = 'topic';

		aggregator.subscribe(topic, noop);
		result = aggregator.publish('unknownTopic', 'message');
		expect(result).toBe(false);
	});

	it("Unsubscribe test - Success", function() {
		var topic = "topic",
			aggregator = new EventAggregator(),
			token = aggregator.subscribe(topic, noop),
			result = aggregator.unsubscribe(token);

		expect(result).toBe(true);
	});

	it("Unsubscribe test - Failure", function() {
		var topic = "topic",
			aggregator = new EventAggregator(),
			token = aggregator.subscribe(topic, noop),
			result = aggregator.unsubscribe('unknownToken');

		expect(result).toBe(false);
	});

	it("PubSub test", function() {
		var pubSub = fungears.connectors.pubSub,
			targetObject = function() {},
			eventName = 'testevent:component1',
			flag = false,
			result;


		var subId = pubSub.subscribe(eventName, function(eventArgs) {
			flag = true;
			result = eventArgs;
		});
		expect(subId).toBeTruthy();

		runs(function() {
			pubSub.publish(eventName, "ABCD");
		});

		waitsFor(function() {
			return flag;
		}, "Event publication failed", 100);

		runs(function() {
			expect(result).toBe("ABCD");
		});
	});

	/*it("IncludeIn test", function() {
		var pubSub = fungears.connectors.pubSub,
			targetObject = function() {},
			eventName = 'testevent:component1',
			flag = false,
			result;

		pubSub.includesIn(targetObject);

		var subId = targetObject.subscribe(eventName, function(eventArgs) {
			flag = true;
			result = eventArgs;
		});
		expect(subId).toBeTruthy();

		runs(function() {
			targetObject.publish(eventName, "ABCD");
		});

		waitsFor(function() {
			flag = true;
		}, "Event publication failed", 100);

		runs(function() {
			expect(result).toBe("ABCD");
		});
	});*/


});
