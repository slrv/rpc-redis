# Rpc-redis - library for RPC via redis

Doc under construction

## Listener example
````javascript
const { RedisRpcFactory } = require('rpc-redis');

// instantinate RpcRedis with default settings
const rpc = RedisRpcFactory('test1');

// handle request
rpc.setRequestListener('test', (data) => {
    return data.test + 1;
});

// handle event
rpc.setEventListener('testEvent', (data) => {
    console.log(data);
});

// start listener
rpc.startListen();
````

## Request example
````javascript
const { RedisRpcFactory } = require('rpc-redis');

// instantinate RpcRedis with default settings
const rpc = RedisRpcFactory('test');

// start listen
rpc.startListen().then(() => {
    // send request
    rpc.sendRequest('test1', 'test', {
        test: 144
    }, true).then(console.log);
    
});
````
