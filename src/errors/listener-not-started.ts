import { RpcRedisError } from "./rpc-redis-error";

export class ListenerNotStarted extends RpcRedisError {
    constructor(
        private readonly _destination: string,
        private readonly _channel: string,
        private readonly _data: any,
    ) {
        super(`Redis subscriber not started. Can't send request for ${_destination}:${_channel}`);
    }

    get destination(): string {
        return this._destination;
    }

    get channel(): string {
        return this._channel;
    }

    get data(): any {
        return this._data;
    }
}
