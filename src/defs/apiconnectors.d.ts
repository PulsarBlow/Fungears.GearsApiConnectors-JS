interface Window {
    opera;
}
interface Object {
	isArray() : boolean;
}
interface String {
    startsWith(str: string): boolean;
    format(...args): string;
}
interface IGuard {
    argumentNotNull(argValue: any, argName: string);
    argumentNotNullOrEmpty(argValue: string, argName: string);
    argumentIsNumber(argValue: any, argName: string);
    argumentIsOptionalNumber(argValue: any, argName: string);
    argumentIsFunction(argValue: any, argName: string);
    argumentIsDefined(argValue: any, argName: string);
}
interface ISystem {
    version: string;
    noop();
    log(...args);
    error();
    debug(enable: boolean);
    guard: IGuard;
}
interface IHttp {
    get(url, query?);
    postJson(url: string, data: Object);
    postForm(url: string, data: Object);
}
interface IEventSubscription {
	subscriptionId: number;
	func: (eventArgs) => any;
}
interface IEventAggregator {
	subscribe(event: string, func: (eventArgs) => any) : number;
	unsubscribe(subscriptionId: number) : boolean;
	publish(event: string, eventArgs) : boolean;
}
interface IOAuth2Options {
    grant_type?: string;
    client_id?: string;
    client_secret?: string;
    scope?: string;
}
interface IApiOptions {
    apiUrl?: string;
    authUrl?: string;
    oauth2?: IOAuth2Options;
    gameId?: number;
}
interface IApi {
    init(options?: IApiOptions);
    postEvent(gameEvent: IGameEvent);
}
interface IListenerOptions {
	apiOptions?: IApiOptions;
	gamerId: number;
	gamerApiKey: string;
}
interface IListener {
	init(options?: IListenerOptions);
	listen();
}
interface IGameEvent {
    gamerId: number;
    gamerApiKey: string;
    actionKey: number;
    location?: string;
}
