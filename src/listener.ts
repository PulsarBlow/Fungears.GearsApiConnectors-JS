/// <reference path="_references.ts" />

module fungears.connectors {
    var defaults: IListenerOptions = {
	    defaultBindingAttributeName: 'data-fungears',
		apiOptions: {},
	    gamerId: null,
	    gamerApiKey: null
    };

	/**
	 * The Listener orchestrates the system
	 * 1. It listens to DOM events associated to player actions
	 * 2. It transforms these DOM events into GameEvent and post them to the Gears Api.
	 * 3. It dispatch the API result (game notifications) to registered callbacks.
	 */
    export class Listener implements IListener{
        private settings: IListenerOptions;
        private api: IApi;

        constructor() {
            this.api = new Api();
        }

		/**
		 * Initializes the listener
		 * 1. Apply and validates the configuration options
		 * 2. Initializes the underlying api component
		 * 3. Registers event handler for future dispatches
		 * @param options
		 */
        public init(options?: IListenerOptions) {
            this.settings = <IListenerOptions>($.extend(true, {}, defaults, options));
	        this.validateSettings();
            this.api.init(this.settings.apiOptions);

	        // Register events handlers
	        pubSub.subscribe(pubSub.events.gameAction, this.handleGameAction.bind(this));
	        pubSub.subscribe(pubSub.events.gameNotification, this.handleGameNotification.bind(this));
        }

	    public listen() {
		    var $targets = $('['+ bindingProvider.bindingName +']');

		    if(!$targets || !$targets.length)
			    return false;
		    $targets.each(function(index, element) {
			    var $this = $(this);
			    var binding = bindingProvider.getBinding(this);
			    if(binding) {
				    $this.on(binding.eventTypes, function() {
					    pubSub.publish(pubSub.events.gameAction, binding.actionKey);
				    });
			    }
		    });
		    return true;
	    }
	    public listenTo($obj: JQuery, eventType: string, actionKey) {
		    if(!$obj || !$obj.length || !eventType) return false;
		    $obj.on(eventType, function() {
			    pubSub.publish(pubSub.events.gameAction,  actionKey);
		    });
		    return true;
	    }

		/**
		 * Registers a callback for the gameAction event.
		 * @param callback  The function to be called when the event is triggered
		 * @param context   This context on to which the callback will be bound
		 * @returns {boolean}
		 */
		public onGameAction(callback, context = this) {
			if(!callback || typeof callback !== 'function')
				return false;
			pubSub.subscribe(pubSub.events.gameAction, callback.bind(context));
			return true;
		}

		/**
		 * Registers a callback for the gameNotification event
		 * The gameNotification event is triggered upon the reception
		 * of a game notification from the Gears Api
		 * @param callback  The function to be called when the event is triggered
		 * @param context   This context on to which the callback will be bound
		 * @returns {boolean}
		 */
		public onGameNotification(callback, context = this) {
			if(!callback || typeof callback !== 'function')
				return false;
			pubSub.subscribe(pubSub.events.gameNotification, callback.bind(context));
			return true;
		}

		private handleGameAction(event, actionKey) {
			system.log("Handling event", pubSub.events.gameAction, actionKey);
			this.api.postEvent({
				gamerId: this.settings.gamerId,
				gamerApiKey: this.settings.gamerApiKey,
				actionKey: actionKey
			}).done(function(notification) {
					pubSub.publish(pubSub.events.gameNotification, notification);
			}).fail(function(jqXHR, textStatus, errorThrown ) {
				system.log("Api post event", pubSub.events.gameAction, jqXHR, textStatus, errorThrown);
			});
		}
		private handleGameNotification(event, notification) {
			system.log("Handling event", pubSub.events.gameNotification, notification);

		}
		private validateSettings() {
			if(!this.settings) this.throwValidationError("null object");
			if(!this.settings.apiOptions) this.throwValidationError("apiOptions is null or undefined")
			if(this.settings.gamerId === undefined || this.settings.gamerId === null)
				this.throwValidationError("gamerId is null or undefined")
			if(!this.settings.gamerApiKey)
				this.throwValidationError("gamerApiKey is null or undefined");
		}
		private throwValidationError(message: string) {
			throw new Error("Listener settings error : {0}".format(message));
		}
    }
}
