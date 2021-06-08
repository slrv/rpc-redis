export class TimeoutError extends Error {
    constructor(
        private readonly _channel: string,
        private readonly _data: any,
        private readonly _timeout: number,
    ) {
        super(`Request timeout for ${_channel} was reached: ${_timeout}`);
    }

    get channel(): string {
        return this._channel;
    }

    get data(): any {
        return this._data;
    }

    get timeout(): number {
        return this._timeout;
    }
}
