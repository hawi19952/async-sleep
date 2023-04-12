import { Channel, ConsumeMessage } from "amqplib";


function consumeMessages(channel: Channel) {
  return async function (msg:ConsumeMessage | null) {
    if(msg) {
      const messageString = msg.content.toString();
      const message = JSON.parse(messageString);
      console.log(message);
      channel.ack(msg);
    }
  }
}

export default consumeMessages;