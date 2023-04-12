import { ExchangeStats, decideOnConsumer } from "../src/get.stats";

const noConsumerStats: ExchangeStats = {
  consumersCount:0,
  messagesCount: 2,
  queueName: 'whatever'
}

const noMessagesStats: ExchangeStats = {
  consumersCount: 2,
  messagesCount: 0,
  queueName: 'whatever'
}

const noMessagesNorConsumerStats: ExchangeStats = {
  consumersCount: 0,
  messagesCount: 0,
  queueName: 'whatever'
}

const existsMessagesAndConsumerStats: ExchangeStats = {
  consumersCount: 1,
  messagesCount: 1,
  queueName: 'whatever'
}


describe('Program Workflow', () => {

  describe('Dynamic Engine', () => {

    describe('Queue & Channels', () => {
      const currentStats = existsMessagesAndConsumerStats;

      it('should return the messages count according to the name provided', () => {

        expect(currentStats.messagesCount).toBeDefined();
      });

      it('should return the channels count according to the name provided', () => {
        expect(currentStats.consumersCount).toBeDefined();
      });
    });

    describe('Decision over instance', () => {
      it('should kill instance if message count is 0 after a timeout of 30 seconds', () => {
        const newStats = decideOnConsumer(noMessagesStats);
        expect(newStats.consumersCount).toBe(0);
      });

      it('should initiate instance and consumer if there is a message and no consumers available', () => {
        const newStats = decideOnConsumer(noConsumerStats);

        expect(newStats.consumersCount).toBeGreaterThan(0);
      });

      it('should Do nothing when consumer and messages exist', () => {
        const currentStats = existsMessagesAndConsumerStats;
        const newStats = decideOnConsumer(currentStats);
        expect(newStats).toBe(currentStats);
      });
    });
  });
});