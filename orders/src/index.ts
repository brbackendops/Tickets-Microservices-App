import 'dotenv/config';
import { randomBytes } from 'crypto';
import "dotenv/config";
import app from "./app";
import logger from "./logger";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreateListener, TicketUpdateListenter } from './events/listen/listen.types';


const PORT = process.env.PORT || 5000
const NATS_URL = process.env.NODE_ENV === "DEV" ? 'nats://127.0.0.1:4222' : process.env.NATS_CLIENT


async function start(){
    
    await natsWrapper.connect('ticketing',randomBytes(4).toString('hex'),NATS_URL!)

    const server = app.listen(PORT, async () => {
        console.log(`server is listening on http://127.0.0.1:${PORT}`)
    });

    new TicketCreateListener(natsWrapper.client).listen();
    new TicketUpdateListenter(natsWrapper.client).listen();

    natsWrapper.client.on('close', () => {
        logger.error("connection closed for NATS client")
        process.exit(1)
    });
    
    process.on('SIGINT', () => {
        natsWrapper.client.close()
        logger.info('nats client closed')
        process.exit(1)
    });
    
    process.on('SIGTERM', () => {
        server.close((err) => {
            if (err) {
    
                logger.error(`error during shutdown ${err}`)
                process.exit(1)
            }
            
            logger.warn(`application shutting down without any error`)
            
            natsWrapper.client.close()
            logger.info('nats client closed')
    
            logger.close()
            process.exit(0)
        })
    
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


start()