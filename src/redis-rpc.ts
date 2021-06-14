import * as IORedis from "ioredis";
import { EventEmitter } from "events";
import { NameResolver, RedisConnector } from "./utils";
import { TransportMessagesFactory } from "./utils";
import { RequestTransportMessage, ResponseTransportMessage, TransportMessage, TransportMessageType } from "./types";
import {ListenerNotStarted, TimeoutError} from "./errors";
import { AddListenerAfterStartedError, NoActionListenersError, NoListenerForChannel } from "./errors";

export class RedisRpc {
    private readonly _sender: IORedis.Redis;
    private readonly _subscriber: IORedis.Redis;
    private _listenerStarted: boolean = false;
    private _listeners: Map<string, Function> = new Map<string, Function>();

    private _eventsHub: EventEmitter = new EventEmitter();
    private _responseWaiters: {[key: string]: NodeJS.Timeout} = {};

    constructor(
        private readonly _redisConnector: RedisConnector,
        private readonly _nameResolver: NameResolver,
        private readonly _transportMessagesFactory: TransportMessagesFactory,
        private readonly _responseTimeout: number = 10000
    ) {
        this._sender = _redisConnector.instance;
        this._subscriber = _redisConnector.instance.duplicate();
    }

    async sendEvent<IData>(channel: string, data: IData, isLocal = false) {
        const channelName = isLocal ?
            this._nameResolver.getLocalEventChannelName(channel) :
            this._nameResolver.getEventChannelName(channel);
        const message = this._transportMessagesFactory.createEventMessage(data);

        return this._sender.publish(channelName, JSON.stringify(message));
    }

    async sendRequest<IData, IResponse>(destination: string, channel: string, data: IData): Promise<ResponseTransportMessage<IResponse>> {
        return new Promise(async (resolve, reject) => {
            if (!this._listenerStarted) {
                return reject(new ListenerNotStarted(destination, channel, data));
            }

            const channelName = this._nameResolver.getChannelName(destination, channel);
            const requestMessage = this._transportMessagesFactory.createRequestMessage(data);
            const waiterJobName = this._nameResolver.getWaiterJobName(channelName, requestMessage);

            this._eventsHub.once(waiterJobName, (data?: ResponseTransportMessage<IResponse>) => {
                if (data) {
                    clearTimeout(this._responseWaiters[waiterJobName]);
                    return resolve(data);
                } else {
                    return reject(new TimeoutError(channelName, data, this._responseTimeout));
                }
            });

            const listeners = await this._sender.publish(channelName, JSON.stringify(requestMessage));

            if (!listeners) {
                this._eventsHub.removeAllListeners(waiterJobName);
                return reject(new NoActionListenersError(channelName, data));
            }

            this._responseWaiters[waiterJobName] = setTimeout(() => {
                this._eventsHub.emit(waiterJobName);
            }, this._responseTimeout);
        });
    }

    setEventListener(channel: string, callback: Function, localEventPath?: string) {
        return this.setListener(this._nameResolver.getEventChannelName(channel, localEventPath), callback);
    }

    setRequestListener(channel: string, callback: Function) {
        return this.setListener(this._nameResolver.getLocalChannelName(channel), callback);
    }

    async startListen() {
        const listeners = await this._subscriber.subscribe(
            ...Array.from(this._listeners.keys()),
            this._nameResolver.getAckChannelName()
        );
        this._subscriber.on('message', (channel, message) => {
            this.listenMessages(channel, message).then();
        });

        console.log(`Subscriptions success ${listeners}`);
        this._listenerStarted = true;

        return listeners;
    }

    private setListener(channel: string, callback: Function) {
        if (this._listenerStarted) {
            throw new AddListenerAfterStartedError(channel);
        }

        this._listeners.set(channel, callback);

        return this;
    }

    private async listenMessages(channel: string, message: any) {
        console.log(`Received ${message} in ${channel}`);
        if (channel === this._nameResolver.getAckChannelName()) {
            return this.handleResponse(message);
        }

        const listener = this._listeners.get(channel);
        if (!listener) {
            throw new NoListenerForChannel(channel, message);
        }

        const body = JSON.parse(message) as TransportMessage<any>;
        const res = await listener(body.data);
        if (body.type === TransportMessageType.REQUEST) {
            await this.sendResponse(res, body as RequestTransportMessage<any>, channel);
        }
    }

    private async sendResponse(result: any, requestMessage: RequestTransportMessage<any>, requestChannel: string) {
        const response = this._transportMessagesFactory.createResponseMessage(result, requestMessage, requestChannel);
        const channel = this._nameResolver.getAckChannelName(requestMessage);
        await this._sender.publish(channel, JSON.stringify(response));
    }

    private async handleResponse(message: string) {
        console.log(`Received response ${message}`);
        const responseMessage = JSON.parse(message) as ResponseTransportMessage<any>;
        const waiterJobName = this._nameResolver.getWaiterJobNameFromResponse(responseMessage);
        this._eventsHub.emit(waiterJobName, responseMessage);
    }
}
