module fungears.connectors {
	var defaultBindingName = "data-fungears";

	function preProcessBinding(bindingString) {
		if(!bindingString)
			return null;
		var str = bindingString.trim();
		// Trim braces '{' surrounding the whole object literal (if any)
		if(str.charCodeAt(0) === 123) str = str.slice(1, -1);

		var elements = str.split(':');
		if(!elements || elements.length !== 2 || !elements[0] || !elements[1])
			return null;
		var result = {
			eventTypes: elements[0].trim(),
			actionKey: elements[1].trim()
		}
		return result;
	}
	export var bindingProvider = {
		bindingName: defaultBindingName,
		getBinding: function(node) {
			var bindingString = bindingProvider.getBindingString(node);
			return bindingString ? preProcessBinding(bindingString) : null;
		},
		getBindingString: function(node) {
			return node.getAttribute ? node.getAttribute(bindingProvider.bindingName): '';
		}
	}
}