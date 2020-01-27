import {createLogger, format, transports} from 'winston';
import Nconf from '../Nconf';

const {combine, timestamp, prettyPrint} = format;
const logger = createLogger({
    level: Nconf.get('logger:level'),
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    defaultMeta: {service: 'user-hobbies'},
    transports: [
        new transports.File(
            {filename: 'error.log', level: Nconf.get('logger:fileLevel')}),
    ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}

export default logger;
