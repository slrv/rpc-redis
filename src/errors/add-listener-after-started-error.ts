export class AddListenerAfterStartedError extends Error {
    constructor(channel: string) {
        super(`Setting listeners after start listening is not permitted. Channel ${channel}`);
    }
}
