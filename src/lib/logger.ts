import winston from 'winston';

/**
 * Structured logging using Winston
 * Provides consistent logging across the application
 */

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    !isProduction &&
      winston.format.colorize({
        colors: {
          error: 'red',
          warn: 'yellow',
          info: 'green',
          http: 'magenta',
          debug: 'white',
        },
      })
  ),
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? JSON.stringify(meta, null, 2)
            : '';
          return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
        })
      ),
    }),

    // Error logs to file (production only)
    ...(isProduction
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json()
            ),
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json()
            ),
          }),
        ]
      : []),
  ],

  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.printf(({ message, timestamp, stack }) => {
        return `[${timestamp}] UNCAUGHT EXCEPTION: ${message}\n${stack}`;
      }),
    }),
  ],

  rejectionHandlers: [
    new winston.transports.Console({
      format: winston.format.printf(({ message, timestamp }) => {
        return `[${timestamp}] UNHANDLED REJECTION: ${message}`;
      }),
    }),
  ],
});

export interface LogContext {
  userId?: string;
  orderId?: string;
  productId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

/**
 * Log info message with context
 */
export function logInfo(message: string, context?: LogContext) {
  logger.info(message, { ...context });
}

/**
 * Log warning message with context
 */
export function logWarn(message: string, context?: LogContext) {
  logger.warn(message, { ...context });
}

/**
 * Log error message with context
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext) {
  const errorMsg = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  logger.error(message, {
    error: errorMsg,
    stack,
    ...context,
  });
}

/**
 * Log debug message with context
 */
export function logDebug(message: string, context?: LogContext) {
  logger.debug(message, { ...context });
}

/**
 * Log API request
 */
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  context?: Omit<LogContext, 'method' | 'endpoint' | 'statusCode' | 'duration'>
) {
  logger.http(`${method} ${path}`, {
    method,
    endpoint: path,
    statusCode,
    duration: `${duration}ms`,
    ...context,
  });
}

/**
 * Log database operation
 */
export function logDatabase(
  operation: string,
  table: string,
  duration: number,
  context?: LogContext
) {
  logger.debug(`Database ${operation} on ${table}`, {
    operation,
    table,
    duration: `${duration}ms`,
    ...context,
  });
}

export default logger;
