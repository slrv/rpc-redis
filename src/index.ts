import { RedisConnector } from "./utils/redis-connector";
import { NameResolver } from "./utils/name-resolver";
import { RedisRpc } from "./redis-rpc";
import { TransportMessagesFactory } from "./utils";
import { OptionsType } from "./types";

export function RedisRpcFactory(options: OptionsType | string) {
    const redisUrl = (typeof options === 'string') ? '' :  options.redisUrl;
    const localPrefix = (typeof options === 'string') ? options :  options.localPrefix;
    const requestTimeout = (typeof options === 'string') ? 10000 :  options.timeout;

    const connector = new RedisConnector(redisUrl);
    const nameResolver = new NameResolver(localPrefix);
    const transportMessagesFactory = new TransportMessagesFactory(nameResolver);

    return new RedisRpc(connector, nameResolver, transportMessagesFactory, requestTimeout);
}
