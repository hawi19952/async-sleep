import parseMessage from "@helpers/parse.message.js";
import { Channel, ConsumeMessage } from "amqplib";


function consumeMessages(channel: Channel) {
  return async function (msg:ConsumeMessage | null) {
    if(msg) {
      const message = parseMessage(msg);
      if(!message) {
        channel.ack(msg)
        return;
      }
      console.log(message);
      setTimeout(() => {
        channel.ack(msg);
      }, 5000);
      
    }
  }
}

export default consumeMessages;