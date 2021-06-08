import {RequestTransportMessage, ResponseTransportMessage} from "../types";

const ACK_PREFIX = 'ack';
const GLOBAL_CHANNEL_PREFIX = 'rpc';

export class NameResolver {
    constructor(
      private readonly _localPrefix: string
    ) {}

    get localPrefix(): string {
        return this._localPrefix;
    }

    getLocalChannelName(channel: string) {
        return this.getChannelName(this._localPrefix, channel);
    }

    getChannelName(destination: string, channel: string) {
        return `${GLOBAL_CHANNEL_PREFIX}:${destination}:${channel}`;
    }

    getLocalEventChannelName(channel: string) {
        return this.getEventChannelName(channel, this._localPrefix);
    }

    getEventChannelName(channel: string, localEventPath?: string) {
        let name = `${GLOBAL_CHANNEL_PREFIX}:`;
        if (localEventPath) {
            name += `${localEventPath}:`;
        }
        name += channel;

        return name;
    }

    getAckChannelName(message?: RequestTransportMessage<any>) {
        let name = `${ACK_PREFIX}:${GLOBAL_CHANNEL_PREFIX}:`;
        name += message ? message.issuer : this._localPrefix;

        return name;
    }

    getWaiterJobName(channel: string, message: RequestTransportMessage<any>) {
        return `${channel}:${message.id}`;
    }

    getWaiterJobNameFromResponse(message: ResponseTransportMessage<any>) {
        return `${message.requestChannel}:${message.requestId}`;
    }
}
