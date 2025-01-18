import { createLogger , transports } from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';


const logDirectory = path.resolve(__dirname, '../misc/logs/');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory,{ recursive: true })
}

/*
format.combine(
        format.timestamp(),
        format.printf(({ timestamp , level , message , ...metadata }) => {
            const metaString = Object.keys(metadata).length ? JSON.stringify(metadata): '';

            return `${timestamp}:[${level}]: ${message} ${metaString}`
        })
    )
*/

const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: ecsFormat({ convertReqRes: true }),
    transports: [
        new transports.Console(),
        // new transports.File({ filename: logDirectory + `/${Date.now()}-app.log` , maxsize: 20 }),
        new transports.DailyRotateFile({
            filename: path.join(logDirectory,'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            
        })
    ]
});


export default logger;