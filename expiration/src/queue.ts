import { ExpirationCompletePublish } from './events/publishers/expiration.complete.publish';
import 'dotenv/config';
import Bull from "bull";
import { natsWrapper } from './nats-wrapper';


interface Payload {
    orderId: number;
}

const queue = new Bull<Payload>('order:expiration',{
    redis: {
        host: process.env.REDIS_HOST
    }
})

queue.process(async (job) => {
    new ExpirationCompletePublish(natsWrapper.client).publish({
        orderId: job.data.orderId
    });
})


export {
    queue
}