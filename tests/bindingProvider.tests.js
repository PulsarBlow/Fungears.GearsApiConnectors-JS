describe("Test for bindindProvider module", function() {
	var bindingProvider = fungears.connectors.bindingProvider;

	it("Get binding test", function() {
		// DOM Fixtures
		setFixtures(sandbox());
		var $sandbox = $("#sandbox");
		$sandbox.attr(bindingProvider.bindingName, "click: DELKDKS3");
		var binding = bindingProvider.getBinding($sandbox.get(0));
		expect(binding).not.toBeNull();
		expect(binding.eventTypes).toBe('click');
		expect(binding.actionKey).toBe('DELKDKS3');
	});

	it("Get complex binding test", function() {
		// DOM Fixtures
		setFixtures(sandbox());
		var $sandbox = $("#sandbox");
		$sandbox.attr(bindingProvider.bindingName, "click dblclick  : DELKDKS3");
		var binding = bindingProvider.getBinding($sandbox.get(0));
		expect(binding).not.toBeNull();
		expect(binding.eventTypes).toBe('click dblclick');
		expect(binding.actionKey).toBe('DELKDKS3');
	});

	it("Get binding test with format errors", function() {
		// DOM Fixtures
		setFixtures(sandbox());
		var $sandbox = $("#sandbox");
		$sandbox.attr(bindingProvider.bindingName, "{click dblclick  : DELKDKS3}");
		var binding = bindingProvider.getBinding($sandbox.get(0));
		expect(binding).not.toBeNull();
		expect(binding.eventTypes).toBe('click dblclick');
		expect(binding.actionKey).toBe('DELKDKS3');
	});
	it("Get complex binding test with error (1)", function() {
		// DOM Fixtures
		setFixtures(sandbox());
		var $sandbox = $("#sandbox");
		$sandbox.attr(bindingProvider.bindingName, ": DELKDKS3");
		var binding = bindingProvider.getBinding($sandbox.get(0));
		expect(binding).toBeNull();
	});
	it("Get complex binding test with error (2)", function() {
		// DOM Fixtures
		setFixtures(sandbox());
		var $sandbox = $("#sandbox");
		$sandbox.attr(bindingProvider.bindingName, "click: ");
		var binding = bindingProvider.getBinding($sandbox.get(0));
		expect(binding).toBeNull();
	});
	it("Get complex binding test with error (3)", function() {
		// DOM Fixtures
		setFixtures(sandbox());
		var $sandbox = $("#sandbox");
		$sandbox.attr(bindingProvider.bindingName, "click: ");
		var binding = bindingProvider.getBinding($sandbox.get(0));
		expect(binding).toBeNull();
	});
});
