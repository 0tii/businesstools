import { createLogger, transports, format } from "winston";
import { formatDate } from "./util/date/DateUtility";

const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors(),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'bt-api' },
    transports: [
        new transports.File({ dirname: 'logs/error', filename: `error_${formatDate(new Date(), 'sortable')}.log`, level: 'error' }),
        new transports.File({ dirname: 'logs', filename: `log_${formatDate(new Date(), 'sortable')}.log` }),
        new transports.File({ dirname: 'logs', filename: `latest.log`, options: { flags: 'w' } }),
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.simple()
            )
        })
    ]
});

export default logger;