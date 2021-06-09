import {NameResolver, TransportMessagesFactory} from "../utils";
import * as Faker from 'faker';

let senderName: string,
    receiverName: string,
    senderNamingResolver: NameResolver,
    receiverNamingResolver: NameResolver;

beforeEach(() => {
    senderName = Faker.random.word();
    receiverName = Faker.random.word();
    senderNamingResolver = new NameResolver(senderName);
    receiverNamingResolver = new NameResolver(receiverName);
});

test('Action channel test', () => {
    const channel = Faker.random.word();
    const channelNameToSend = senderNamingResolver.getChannelName(receiverName, channel);
    const channelNameToReceive = receiverNamingResolver.getLocalChannelName(channel);

    expect(channelNameToSend).toBe(channelNameToReceive);
});

test('Acknowledgment channel test', () => {
    const transportMessagesFactory = new TransportMessagesFactory(receiverNamingResolver);
    const requestMessage = transportMessagesFactory.createRequestMessage({});
    const channelNameForResponse = senderNamingResolver.getAckChannelName(requestMessage);
    const channelNameForReceiveAcknowledgment = receiverNamingResolver.getAckChannelName();

    expect(channelNameForResponse).toBe(channelNameForReceiveAcknowledgment);
});

test('Event channel test', () => {
    const channel = Faker.random.word();
    const channelNameToSend = senderNamingResolver.getLocalEventChannelName(channel);
    const channelNameToReceive = receiverNamingResolver.getEventChannelName(channel, senderName);

    expect(channelNameToSend).toBe(channelNameToReceive);
});

test('Waiter name test', () => {
    const channel = Faker.random.word();
    const transportMessagesFactory = new TransportMessagesFactory(receiverNamingResolver);
    const requestMessage = transportMessagesFactory.createRequestMessage({});
    const responseMessage = transportMessagesFactory.createResponseMessage({}, requestMessage, channel);
    const localWaiterJobName = senderNamingResolver.getWaiterJobName(channel, requestMessage);
    const receivedWaiterJobName = receiverNamingResolver.getWaiterJobNameFromResponse(responseMessage);

    expect(localWaiterJobName).toBe(receivedWaiterJobName);
});
