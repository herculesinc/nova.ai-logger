declare module "@nova/ia-logger" {
    
    // GLOBAL LOGGER
    // --------------------------------------------------------------------------------------------
    export type LogLevel = 'debug' | 'information' | 'warning' | 'error';
    export interface LoggerConfig {
        readonly iKey           : string;
        readonly appVersion?    : string;
        readonly appName?       : string;
        readonly appInstance?   : string;
        readonly logLevel?      : { [key: string]: LogLevel };
    }

    export function configure(options: LoggerConfig);

    export function debug(message: string);
    export function info(message: string);
    export function warn(message: string);

    export function error(error: Error);
    export function track(metric: string, value: number);

    export function startOperation(options: OperationOptions, startTime?: number): OperationLogger;

    export function flush(isAppCrashing: boolean, callback?: (message: string) => void);

    // OPERATION LOGGER
    // --------------------------------------------------------------------------------------------
    export interface OperationOptions {
        readonly operationId    : string;
        readonly operationName  : string;
        
        readonly requestName?   : string;
        readonly requestUrl?    : string;
        readonly requestIp?     : string;

        readonly componentName? : string;
        readonly parentId?      : string;
    }

    export interface TraceSource {
        name    : string;
        type    : 'http' | 'sql' | 'redis' | 'azure queue' | 'azure service bus' | 'azure blob' | 'azure table' | 'web service';
    }

    export interface TraceCommand {
        name    : string;
        text    : string;
    }

    export interface OperationLogger {

        readonly operationId    : string;

        authenticatedUserId?    : string;

        debug(message: string);
        info(message: string);
        warn(message: string);

        error(error: Error);
        trace(source: TraceSource, command: TraceCommand, duration: number, success: boolean);

        close(resultCode: number, success: boolean, properties?: { [key: string]: string; });
    }
}