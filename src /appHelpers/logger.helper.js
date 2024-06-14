import winston from "winston";
const { combine, timestamp, printf, colorize, align, errors } = winston.format;

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
        http: 'cyan',//'white',
        debug: 'green',
    }
}

// Usamos esta lógica para filtrar mensajes específicos y que los archivos logueen solo el nivel asignnado

const fatalFilter = winston.format((info, opts) => {
    return info.level === 'fatal' ? info : false;
})
const errorFilter = winston.format((info, opts) => {
    return info.level === 'error' ? info : false;
})
const warningFilter = winston.format((info, opts) => {
    return info.level === 'warning' ? info : false;
})
const infoFilter = winston.format((info, opts) => {
    return info.level === 'info' ? info : false;
})
const httpFilter = winston.format((info, opts) => {
    return info.level === 'http' ? info : false;
})
const debugFilter = winston.format((info, opts) => {
    return info.level === 'debug' ? info : false;
})


// Usamos esta definición de formato para el FileFormat asi no tenemos colores escapados
const logFileFormat = printf((info) => `[${info.timestamp}] | ${info.level} | ${info.message}`);
const logConsoleFormat =  printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `[${timestamp}] ${level}: ${message}`;

    if (stack) {
        msg += `\nStack trace:\n${stack}`;
    }

    if (Object.keys(metadata).length > 0) {
        msg += `\nMetadata:\n${JSON.stringify(metadata, null, 2)}`; // Identado 2 sangrias
    }

    return msg;
});

console.log("------ CONFIGURANDO LOGGER ------")
console.log("LOGGER LEVEL => ", process.env.LOG_LEVEL)
console.log("LOGGER FOLDER => ", process.env.LOG_FOLDER)
console.log("------ LOGGER CONFIGURADO  ------")

/* Utilización customizada - Con nuestros niveles y personalizacion */
export const customLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    levels: customLevelsOptions.levels,

    // Opciones de formato COMUN a TODO NIVEL DE TRANSPORTE
    format: combine(
        /* Detalle: si dejo aqui, los File van a verse con "detalles"
         * de colores ASCII, entonces mejor solo definirlos a nivel de console.
         */
        // colorize({ all: true, colors: customLevelsOptions.colors }),

        // Esto si, es comun a todos. FORMATO DE FECHA.
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),

        // Incluimos stack trace si aplica
        errors({ stack: true }),

        // Comun a todos => alineacion.
        align(),

        // Comun a todos => patron de impresión
        // printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
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
            filename: `./logs/${process.env.LOG_FOLDER}/error.log`,
            level: "error",
            format: combine(
                errorFilter(),
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
        // Catch-all transport for all levels
        new winston.transports.File({
            filename: `./logs/${process.env.LOG_FOLDER}/all.log`,
            format: combine(
                logFileFormat
            )
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: `./logs/${process.env.LOG_FOLDER}/exception.log` }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: `./logs/${process.env.LOG_FOLDER}/rejections.log` }),
    ],
});


/* Utilización estandar - Propios niveles de Winston */
/*
export const standardLogger = winston.createLogger({
    level: "warn",
    transports: [
        new winston.transports.Console({ level: "http" }), //"info"
        new winston.transports.File({ filename: `./logs/${process.env.LOG_FOLDER}/warn.log`, level: "warn" }),
        new winston.transports.File({ filename: `./logs/${process.env.LOG_FOLDER}/error.log`, level: "error" })
    ]
})
*/

