import {RequestTransportMessage, ResponseTransportMessage} from "../types";

const ACK_PREFIX = 'ack';
const GLOBAL_CHANNEL_PREFIX = 'rpc';

export class NameResolver {
    constructor(
      private readonly _localPrefix: string
    ) {}

    /**
     * Public getter for localPrefix value
     */
    get localPrefix(): string {
        return this._localPrefix;
    }

    /**
     * Return name channel for local action handler
     * @param channel
     */
    getLocalChannelName(channel: string) {
        return this.getChannelName(this._localPrefix, channel);
    }

    /**
     * Return name channel for action handler
     * @param destination
     * @param channel
     */
    getChannelName(destination: string, channel: string) {
        return `${GLOBAL_CHANNEL_PREFIX}:${destination}:${channel}`;
    }

    /**
     * Return name channel for local event
     * @param channel
     */
    getLocalEventChannelName(channel: string) {
        return this.getEventChannelName(channel, this._localPrefix);
    }

    /**
     * Return name channel for event
     * @param channel
     * @param localEventPath
     */
    getEventChannelName(channel: string, localEventPath?: string) {
        let name = `${GLOBAL_CHANNEL_PREFIX}:`;
        if (localEventPath) {
            name += `${localEventPath}:`;
        }
        name += channel;

        return name;
    }

    /**
     * Return name channel for acknowledgment handler
     * @param message
     */
    getAckChannelName(message?: RequestTransportMessage<any>) {
        let name = `${ACK_PREFIX}:${GLOBAL_CHANNEL_PREFIX}:`;
        name += message ? message.issuer : this._localPrefix;

        return name;
    }

    /**
     * Return waiter name for creation
     * @param channel
     * @param message
     */
    getWaiterJobName(channel: string, message: RequestTransportMessage<any>) {
        return `${channel}:${message.id}`;
    }

    /**
     * Return waiter name from response
     * @param message
     */
    getWaiterJobNameFromResponse(message: ResponseTransportMessage<any>) {
        return `${message.requestChannel}:${message.requestId}`;
    }
}
