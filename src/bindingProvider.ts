/// <reference path="_references.ts" />

module fungears.connectors {
	var defaultBindingName = "data-fungears";

    /**
     * Converts a binding string into an IBindingResult object.
     * @param bindingString
     * @returns {*}
     */
	function preProcessBinding(bindingString) : IBindingResult {
		if(!bindingString)
			return null;
		var str = bindingString.trim();
		// Trim braces '{' surrounding the whole object literal (if any)
		if(str.charCodeAt(0) === 123) str = str.slice(1, -1);

		var elements = str.split(':');
		if(!elements || elements.length !== 2 || !elements[0] || !elements[1])
			return null;
		var result: IBindingResult = {
			eventTypes: elements[0].toLowerCase().trim(), // Enforce lower casing (jQuery events are lowercase)
			actionKey: elements[1].trim()
		}
		return result;
	}

    /**
     * BindingProvider is responsible for reading and parsing HTML element attribute binding.
     */
    export class BindingProvider implements IBindingProvider {
        public bindingName: string;

        constructor(bindingName: string = defaultBindingName) {
            this.bindingName = bindingName || defaultBindingName;
        }

        /**
         * Reads and return the attribute bound to the given HTML element
         * @param node
         * @returns {*}
         */
        public getBinding(node) : IBindingResult {
            var bindingString = this.getBindingString(node);
            return bindingString ? preProcessBinding(bindingString) : null;
        }
        private getBindingString(node) {
            return node.getAttribute ? node.getAttribute(this.bindingName): '';
        }
    }
}