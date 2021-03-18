import * as winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({level, message, timestamp, eventType}) => {
    return `[${level}] ${timestamp} ${eventType || "DefaultEvent"}: ${message}`;
});

const stdout = new winston.transports.Console({level: 'info'});
const file_out = new winston.transports.File({filename: path.join(process.cwd(), "logs", "log.txt"), maxsize: 10000});

export const logger: winston.Logger = winston.createLogger({
    format: combine(
        timestamp({format: 'YY-MM-DD HH:mm:ss'}),
        colorize(),
        logFormat
    ),
});

if (process.env.NODE_ENV === 'production') {
    logger.add(file_out);
} else {
    logger.add(stdout);
}

export const gameEventLogger = logger.child({eventType: "GameEvent"});
export const websocketEventLogger = logger.child({eventType: "WebSocketEvent"});
