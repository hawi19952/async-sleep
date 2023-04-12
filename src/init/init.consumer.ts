import getQueueChannel from "../exchange/rabbit.mq";
import consumeMessages from "../modules/consume.message";

const QUEUE_NAME = 'requests';

async function initMessagesConsumer() {
  const channel = await getQueueChannel(QUEUE_NAME);

  if(channel) {
    channel.prefetch(1);
    channel.consume(QUEUE_NAME, consumeMessages(channel), {noAck: false});
  }
}

export default initMessagesConsumer;