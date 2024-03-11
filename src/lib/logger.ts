import winston from "winston";
import moment from "moment";

enum Color {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",

    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m",

    LightGrey = "\x1b[90m",
    LightRed = "\x1b[91m",
    LightGreen = "\x1b[92m",
    LightYellow = "\x1b[93m",
    LightBlue = "\x1b[94m",
    LightMagenta = "\x1b[95m",
    LightCyan = "\x1b[96m",
    LightWhite = "\x1b[97m",
}

function removeColorCodes(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, "");
}

// Create a new Winston logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    const formattedTimestamp = moment(timestamp).format("YYYY-MM-DD HH:mm:ss Z");
                    const paddedLevel = level.padEnd(15);
                    const strippedLevel = removeColorCodes(level);
                    const colorizedMessage = strippedLevel === "error" ? `${Color.FgRed}${message}${Color.Reset}` : message;
                    return `${Color.LightGrey}${formattedTimestamp}${Color.Reset} | ${paddedLevel} | ${colorizedMessage}`;
                })
            ),
        }),
        new winston.transports.File({
            filename: `logs/${moment().format("YYYY-MM-DD")}.log`,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    const formattedTimestamp = moment(timestamp).format("YYYY-MM-DD HH:mm:ss Z");
                    const paddedLevel = level.padEnd(15);
                    return `${formattedTimestamp} | ${paddedLevel} | ${removeColorCodes(message)}`;
                })
            ),
        }),
    ],
});

// Export a function to add a new log level
function addLogLevel(level: string, priority: number, color: Color) {
    logger.levels[level] = priority;
    winston.addColors({ [level]: color });
}

function setLogLevel(level: string) {
    logger.level = level;
}

export default logger;
export { logger as log, addLogLevel, setLogLevel };
