import * as IORedis from "ioredis";

export class RedisConnector {
    private readonly _instance: IORedis.Redis;

    constructor (port?: number, host?: string, options?: IORedis.RedisOptions);
    constructor (host?: string, options?: IORedis.RedisOptions);
    constructor (options?: IORedis.RedisOptions);
    constructor(...options: any) {
        this._instance = new IORedis(...options);
        this._instance.on('connect', () => this.onConnected());
        this._instance.on('error', (e) => this.onError(e));
    }

    get instance() {
        return this._instance;
    }

    private onConnected() {
        console.log('Redis connected');
    }

    private onError(e: any) {
        console.error('Redis connection error', e);
    }
}
