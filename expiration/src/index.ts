import 'dotenv/config';
import { randomBytes } from 'crypto';
import logger from "./logger";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from './events/listeners/order.created.listener';


const NATS_URL = process.env.NODE_ENV === "DEV" ? 'nats://127.0.0.1:4222' : process.env.NATS_CLIENT;


async function start() {
    
    await natsWrapper.connect('ticketing',randomBytes(4).toString('hex'),NATS_URL!);
    console.log('connected to NATS');
    

    new OrderCreatedListener(natsWrapper.client).listen()

    natsWrapper.client.on('close', () => {
        logger.error("connection closed for NATS client")
        process.exit(1)
    })
    
    process.on('SIGINT', () => {
        natsWrapper.client.close()
        logger.info('nats client closed')
        process.exit(1)
    })
    
    process.on('SIGTERM', () => {
        logger.warn(`application shutting down without any error`);
        natsWrapper.client.close();
        logger.info('nats client closed');
        setTimeout(() => {
            logger.warn(`application forcefuly shutting down after 10seconds`)
            logger.close()
            process.exit(0)
        },10000)
    });
    
    process.on('uncaughtException', (reason) => {    
        logger.error(`uncaught exception: error not catched by try/catch block : reason: ${reason}`)
        process.exit(1)
    
    });
    
    process.on('unhandledRejection', (reason,promise) => {    
        logger.error(`unhandled promise errors caught, reason: ${reason}`)
        process.exit(1)
    });
}

start();




