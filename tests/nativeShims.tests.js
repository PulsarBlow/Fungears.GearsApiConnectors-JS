describe("Testing native shims", function() {

	it("String startsWith Tests", function() {
		expect("1234abcd".startsWith("1234")).toBe(true);
		expect("abcd".startsWith("1234")).toBe(false);
		expect("é#'abcd".startsWith("é#'")).toBe(true);
	});

	it("String format Tests", function() {
		expect("https://{0}/{1}/{2}".format("api.fungears.com", "resource", "id" )).toBe(
			"https://api.fungears.com/resource/id");
	});

	it("IsArray Tests", function() {
		expect(Array.isArray([])).toBe(true);
		expect(Array.isArray({})).toBe(false);
		expect(Array.isArray("")).toBe(false);
	});
});
