/// <reference path="_references.ts" />

module fungears.connectors {
    var defaults: IListenerOptions = {
	        defaultBindingName: 'data-fungears',
            eventTypes: 'click dblclick',
            delegatedTarget: document,
	        gamerId: null,
	        gamerApiKey: null,
            apiOptions: {}
        },
        notificationTypeEventMap = {
            "0": undefined,
            "1": pubSub.events.levelChanged,
            "2": pubSub.events.achievementReceived,
            "3": pubSub.events.currencyReceived,
            "4": pubSub.events.pointReceived,
            "5": pubSub.events.goodReceived,
            "70": pubSub.events.engineError,
            "71": pubSub.events.engineNotice
        };

	/**
	 * The Listener orchestrates the system
	 * 1. It listens to DOM events associated to player actions
	 * 2. It transforms these DOM events into GameEvent and post them to the Gears Api.
	 * 3. It dispatch the API result (game notifications) to registered callbacks.
	 */
    export class Listener implements IListener{
        private subscriptions = [];
        private disposed: boolean = false;
        private settings: IListenerOptions;
        private bindingProvider: IBindingProvider;
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
            this.bindingProvider = new BindingProvider(this.settings.defaultBindingName);

	        // Register events handlers
	        this.subscriptions.push(pubSub.subscribe(pubSub.events.gameAction, this.handleGameAction.bind(this)));
            this.subscriptions.push(pubSub.subscribe(pubSub.events.gameNotification, this.handleGameNotification.bind(this)));
        }

        /**
         * Listens to every gameEvents initiated by the present elements declaring a binding.
         * @returns {boolean}
         */
	    public listen() {
		    var bindingProvider = this.bindingProvider,
                $targets = $('['+ bindingProvider.bindingName +']');

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

        /**
         * Listens to all present and future element declaring a binding.
         * Filters out events not declared in the Listener settings eventTypes property.
         * @returns {boolean}
         */
        public delegatedListen() {
            var eventTypes = this.settings.eventTypes.toLowerCase(),
                bindingProvider = this.bindingProvider;
            $(this.settings.delegatedTarget).on(this.settings.eventTypes, '[' + bindingProvider.bindingName + ']', function(event) {
                if (eventTypes.indexOf(event.type) === -1)
                    return true; // do not process (but still, allow propagation)
                var binding = bindingProvider.getBinding(this);
                pubSub.publish(connectors.pubSub.events.gameAction, binding.actionKey);
                return true;
            });
            return true;
        }

        /**
         * Registers a gameEvent listener for a specific element.
         * This is the case when you don't want to use declarative bindings.
         * @param $obj
         * @param eventType
         * @param actionKey
         * @returns {boolean}
         */
	    public listenTo($obj: JQuery, eventType: string, actionKey: string) {
		    if(!$obj || !$obj.length || !eventType) return false;
		    $obj.on(eventType, function() {
			    pubSub.publish(pubSub.events.gameAction,  actionKey);
		    });
		    return true;
	    }

		/**
		 * Registers a callback which will be called after a gameEvent has been triggered
         * and before the gameEvent is sent to the Gears Api
		 * @param callback  The function to be called when the event is triggered
		 * @param context   This context on to which the callback will be bound
		 * @returns {boolean}
		 */
		public onGameAction(callback, context = this) {
            return this.on(pubSub.events.gameAction, callback, context);
		}

		/**
		 * Registers a callback for the gameNotification event
		 * The gameNotification event is triggered upon the reception
		 * of a game notification from the Gears Api.
         * Use this event if you want to implements your own game notification type dispatcher.
		 * @param callback  The function to be called when the event is triggered
		 * @param context   This context to which the callback will be bound.
		 * @returns {boolean}
		 */
		public onGameNotification(callback, context = this) {
            return this.on(pubSub.events.gameNotification, callback, context);
		}

        /**
         * Registers a callback which is called when a level has changed.
         * @param callback
         * @param context
         * @returns {boolean}
         */
        public onLevelChanged(callback, context = this):boolean {
            return this.on(pubSub.events.levelChanged, callback, context);
        }

        /**
         * Registers a callback which is called upon reception of a new achievement.
         * @param callback
         * @param context
         * @returns {boolean}
         */
        public onAchievementReceived(callback, context = this): boolean {
            return this.on(pubSub.events.achievementReceived, callback, context);
        }

        /**
         * Registers a callback which is called upon reception of some currencies.
         * @param callback
         * @param context
         * @returns {boolean}
         */
        public onCurrencyReceived(callback, context = this): boolean {
            return this.on(pubSub.events.currencyReceived, callback, context);
        }

        /**
         * Registers a callback which is called upon reception of some level points.
         * @param callback
         * @param context
         * @returns {boolean}
         */
        public onPointReceived(callback, context = this): boolean {
            return this.on(pubSub.events.pointReceived, callback, context);
        }

        /**
         * Registers a callback which is called upon reception of a new good.
         * @param callback
         * @param context
         * @returns {boolean}
         */
        public onGoodReceived(callback, context = this): boolean {
            return this.on(pubSub.events.goodReceived, callback, context);
        }

        /**
         * Dispose the current listener.
         * Clean underlying aggregator subscriptions and other event handlers.
         */
        public dispose() {
            if(this.disposed)
                return;
            var i = 0;
            for(i; i < this.subscriptions.length; i++) {
                pubSub.unsubscribe(this.subscriptions[i]);
            }
            this.subscriptions = [];
            this.api = null;
            this.bindingProvider = null;
            this.disposed = true;
        }

        //region Privates
        private on(eventType: string, callback, context = this): boolean{
            if(!eventType || !callback || typeof callback !== 'function')
                return false;
            this.subscriptions.push(pubSub.subscribe(eventType, callback.bind(context)));
            return true;
        }
		private handleGameAction(actionKey) {
			system.log("Handling event", pubSub.events.gameAction, actionKey);
			this.api.postEvent({
				gamerId: this.settings.gamerId,
				gamerApiKey: this.settings.gamerApiKey,
				actionKey: actionKey
			}).done(function(notifications) {
					pubSub.publish(pubSub.events.gameNotification, notifications);
			}).fail(function(jqXHR, textStatus, errorThrown ) {
				system.log("Api post event", pubSub.events.gameAction, jqXHR, textStatus, errorThrown);
			});
		}
		private handleGameNotification(notifications) {
			system.log("Handling event", pubSub.events.gameNotification, notifications);
            if(!notifications) return;

            // Single notification
            var safeArray = Array.isArray(notifications) ? notifications : [notifications];
            $.each(safeArray, (index, item) => {
                if(notificationTypeEventMap[item.type])
                    pubSub.publish(notificationTypeEventMap[item.type], item);
            });
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
        //endregion
    }
}
