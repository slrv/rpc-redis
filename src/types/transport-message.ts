export enum TransportMessageType {
    EVENT = 'event',
    REQUEST = 'request',
    RESPONSE = 'response'
}

export type TransportMessage<IData> = {
    id: string,
    timestamp: number,
    issuer: string,
    type: TransportMessageType,
    data: IData,
}

export type EventTransportMessage<IData> = TransportMessage<IData> & {type: TransportMessageType.EVENT};
export type RequestTransportMessage<IData> = TransportMessage<IData> & {type: TransportMessageType.REQUEST};
export type ResponseTransportMessage<IData> = TransportMessage<IData> & {
    type: TransportMessageType.RESPONSE
    requestId: string,
    requestTimestamp: number,
    requestChannel: string
};
