import {RpcRedisError} from "./rpc-redis-error";

export class AddListenerAfterStartedError extends RpcRedisError {
    constructor(channel: string) {
        super(`Setting listeners after start listening is not permitted. Channel ${channel}`);
    }
}
