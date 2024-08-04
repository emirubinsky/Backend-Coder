import winston from "winston";
import process from 'process';
const { combine, timestamp, printf, colorize, align, errors, json } = winston.format;

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'whiteBG bold red',
        error: 'bold magenta',
        warning: 'italic yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'green',
    }
}

const fatalFilter = winston.format((info, opts) => info.level === 'fatal' ? info : false);
const errorFilter = winston.format((info, opts) => info.level === 'error' ? info : false);
const warningFilter = winston.format((info, opts) => info.level === 'warning' ? info : false);
const infoFilter = winston.format((info, opts) => info.level === 'info' ? info : false);
const httpFilter = winston.format((info, opts) => info.level === 'http' ? info : false);
const debugFilter = winston.format((info, opts) => info.level === 'debug' ? info : false);

const logFileFormat = printf(info => `[${info.timestamp}] | ${info.level} | ${info.message}`);
const logErrorFormat = printf(({ level, message, timestamp, stack }) => `${timestamp} ${level}: ${message} ${stack || ''}`);
const logConsoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `[${timestamp}] ${level}: ${message}`;
    if (stack) msg += `\nStack trace:\n${stack}`;
    if (Object.keys(metadata).length > 0) msg += `\nMetadata:\n${JSON.stringify(metadata, null, 2)}`;
    return msg;
});

console.log("------ CONFIGURANDO LOGGER ------");
console.log("LOGGER LEVEL => ", process.env.LOG_LEVEL);
console.log("LOGGER FOLDER => ", process.env.LOG_FOLDER);
console.log("------ LOGGER CONFIGURADO  ------");

export const customLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    levels: customLevelsOptions.levels,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        errors({ stack: true }),
        align()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                logConsoleFormat,
                colorize({ all: true, colors: customLevelsOptions.colors }),
            )
        }),
        new winston.transports.File({
            filename: `./logs/${process.env.LOG_FOLDER}/fatal.log`,
            level: "fatal",
            format: combine(
                fatalFilter(),
                logFileFormat
            )
        }),
        new winston.transports.File({
            filename: `./logs/${process.env.LOG_FOLDER}/warning.log`,
            level: "warning",
            format: combine(
                warningFilter(),
                logFileFormat
            )
        }),
        new winston.transports.File({
            filename: `./logs/${process.env.LOG_FOLDER}/debug.log`,
            level: "debug",
            format: combine(
                debugFilter(),
                logFileFormat
            )
        }),
        new winston.transports.File({
            filename: `./logs/${process.env.LOG_FOLDER}/all.log`,
            format: combine(
                logFileFormat
            )
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: `./logs/${process.env.LOG_FOLDER}/exceptionnn.log`,
            format: combine(
                timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
                logErrorFormat
            )
        }),
    ],
    exitOnError: false
});