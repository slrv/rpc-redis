import {
    EventTransportMessage,
    RequestTransportMessage,
    ResponseTransportMessage,
    TransportMessage,
    TransportMessageType
} from "../types";
import {generateRandomString} from "./string-utils";
import {NameResolver} from "./name-resolver";

export class TransportMessagesFactory {
    constructor(private readonly _nameResolver: NameResolver) {
    }

    createEventMessage<IData>(data: IData): EventTransportMessage<IData> {
        return this.createMessage(data, TransportMessageType.EVENT) as EventTransportMessage<IData>;
    }

    createRequestMessage<IData>(data: IData): RequestTransportMessage<IData> {
        return this.createMessage(data, TransportMessageType.REQUEST) as RequestTransportMessage<IData>;
    }

    createResponseMessage<IData>(data: IData, requestMessage: RequestTransportMessage<any>, requestChannel: string): ResponseTransportMessage<IData> {
        return {
            ...this.createMessage(data, TransportMessageType.RESPONSE),
            requestId: requestMessage.id,
            requestTimestamp: requestMessage.timestamp,
            requestChannel
        } as ResponseTransportMessage<IData>;
    }

    private createMessage<IData>(data: IData, type: TransportMessageType): TransportMessage<IData> {
        return {
            id: generateRandomString(),
            timestamp: Date.now(),
            issuer: this._nameResolver.localPrefix,
            type,
            data,
        };
    }
}
