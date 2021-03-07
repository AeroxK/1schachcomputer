import * as winston from 'winston';

const { combine, timestamp, label, printf, colorize } = winston.format;

const gameEventFormat = printf(({level, message, label, timestamp, eventType}) => {
    return `[${level}] ${timestamp} ${eventType} : ${message}`;
});

const logger: winston.Logger = winston.createLogger({
    format: combine(
        timestamp({format: 'YY-MM-DD HH:mm:ss'}),
        colorize(),
        gameEventFormat
    ),
    transports: [
        new winston.transports.Console({ level: 'info' }), //level = maximum level this transport will log
        // define file logging here, only for prod
    ],
});

export const gameEventLogger = logger.child({eventType: "GameEvent"});
export const websocketEventLogger = logger.child({eventType: "WebSocketEvent"});

// Log levels:
// error: 0, 
// warn: 1, 
// info: 2, 
// http: 3,
// verbose: 4, 
// debug: 5, 
// silly: 6 
