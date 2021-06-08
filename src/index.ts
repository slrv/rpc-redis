import { RedisConnector } from "./utils/redis-connector";
import { NameResolver } from "./utils/name-resolver";
import { RedisRpc } from "./redis-rpc";
import { TransportMessagesFactory } from "./utils";
import { OptionsType } from "./types";

export function RedisRpcFactory(options: OptionsType) {
    const connector = new RedisConnector(options.redisUrl);
    const nameResolver = new NameResolver(options.localPrefix);
    const transportMessagesFactory = new TransportMessagesFactory(nameResolver);

    return new RedisRpc(connector, nameResolver, transportMessagesFactory, options.timeout);
}
