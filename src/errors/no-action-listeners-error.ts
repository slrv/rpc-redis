export class NoActionListenersError extends Error {
    constructor(
        private readonly _channel: string,
        private readonly _data: any
    ) {
        super(`No action listener for channel ${_channel}. No one is able to respond`);
    }

    get channel(): string {
        return this._channel;
    }

    get data(): any {
        return this._data;
    }
}
