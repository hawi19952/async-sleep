import { ConsumeMessage } from "amqplib";

function parseMessage(queueMessage:ConsumeMessage) {
  const msg = queueMessage.content.toString();
  try {
    const message = JSON.parse(msg);
    return message;
  } catch (error) {
    console.log('failed to parse as message as json');
    console.log(`message content is ${msg}`);
    
  }
}

export default parseMessage