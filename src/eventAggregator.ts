/// <reference path="_references.ts" />
module fungears.connectors {

	export class EventSubscription implements IEventSubscription {
		public subscriptionId: number;
		public func: (eventArgs) => any;

		constructor(subscriptionId: number, func: (eventArgs) => any) {
			this.subscriptionId = subscriptionId;
			this.func = func;
		}
	}
	export class EventAggregator implements IEventAggregator {
		private subUid:number = 0;
		private subscriptions = {};

		/**
		 * Subscribe to a given event channel
		 * @param event The event to subscribe to
		 * @param func  The callback to be called when the event occurs
		 */
		public subscribe(event: string, func: (eventArgs) => any) : number {
			if(!this.subscriptions[event]) {
				this.subscriptions[event] = [];
			}
			var subscription = new EventSubscription(++this.subUid, func);
			this.subscriptions[event].push(subscription);
			return subscription.subscriptionId;
		}

		/**
		 * Unsubscribe from a given event channel
		 * @param subscriptionId
		 * @returns {boolean}
		 */
		public unsubscribe(subscriptionId: number) : boolean {
			var m, i, j;
			for(m in this.subscriptions) {
				if(this.subscriptions[m]) {
					for(i = 0, j = this.subscriptions[m].length; i < j; i++) {
						if(this.subscriptions[m][i].subscriptionId === subscriptionId) {
							this.subscriptions[m].splice(i, 1);
							return true;
						}
					}
				}
			}
			return false;
		}

		/**
		 * Publish a message (eventArgs) to a given event channel
		 * @param event
		 * @param eventArgs
		 * @returns {boolean}
		 */
		public publish(event: string, eventArgs) {
			if(!this.subscriptions[event]) {
				return false;
			}
			setTimeout(() => {
				var subscribers = this.subscriptions[event],
					len = subscribers ? subscribers.length : 0;

				while(len--) {
					subscribers[len].func(eventArgs);
				}
			}, 0);
			return true;
		}

		/**
		 * Reverts the event aggregator to its initial state by destroying all existing subscriptions.
		 */
		public reset() {
			this.subUid = 0;
			this.subscriptions = {};
		}
	}

	// This following code is a bit hacky because of a Typescript bug
	// https://typescript.codeplex.com/workitem/917
	//
	// We should be able to simply do the following (which doesn't work atm) :
	// var pubSub = new EventAggregator();
	// pubSub.events = ...
	// pubSub.includesIn = function() ...
	var globalAggregator = new EventAggregator();
	export var pubSub =  {
		events: {
			gameAction: 'fungears:gameAction',
			gameNotification: 'fungears:gameNotification'
		},
		publish: function(event, message) {
			return globalAggregator.publish(event, message);
		},
		subscribe: function(event, func) {
			return globalAggregator.subscribe(event, func);
		},
		unsubscribe: function(subId) {
			return globalAggregator.unsubscribe(subId);
		},
		includesIn: function(targetObject) {
			targetObject.subscribe = globalAggregator.subscribe;
			targetObject.unsubscribe = globalAggregator.unsubscribe;
			targetObject.publish = globalAggregator.publish;
		}
	}
}
