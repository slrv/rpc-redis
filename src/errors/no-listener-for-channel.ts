export class NoListenerForChannel extends Error {
    constructor(
        private readonly _channel: string,
        private readonly _incomingMessage: string
    ) {
        super(`Missed handler for channel ${_channel}. Looks like it was deleted in runtime`);
    }

    get channel(): string {
        return this._channel;
    }

    get incomingMessage(): any {
        return this._incomingMessage;
    }
}
