import amqp, { Channel } from 'amqplib'

const RABBTITMQ_URI = 'amqp://user:password@localhost:5672';


async function getQueueChannel (queueName: string) : Promise<Channel | undefined> {
  const connection = await amqp.connect(RABBTITMQ_URI)

  connection.on("error", (error) => {
    console.log(`[AMQP]: failed connection to rabbitmq, ERROR: \n ${error}`);
    process.exit(0);
  })

  connection.on("close", () => {
    console.log(`[AMQP]: connection to rabbitmq is closed`);
    process.exit(0);
  })

  console.log(`[AMQP]: connected`);
  
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  
  return channel;
}

export default getQueueChannel;