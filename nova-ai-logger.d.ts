declare module "@nova/ai-logger" {
    
    // IMPORTS AND RE-EXPORTS
    // --------------------------------------------------------------------------------------------
    import * as nova from '@nova/core';
    export { TraceSource, TraceCommand, TraceDetails } from '@nova/core';

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

    export function configure(options: LoggerConfig): void;

    export function debug(message: string)  : void;
    export function info(message: string)   : void;
    export function warn(message: string)   : void;

    export function error(error: Error)     : void;
    export function track(metric: string, value: number): void;

    export function startOperation(options: OperationOptions, startTime?: number): OperationLogger;

    export function flush(isAppCrashing: boolean, callback?: (message: string) => void): void;

    // OPERATION LOGGER
    // --------------------------------------------------------------------------------------------
    export type SourceType = 'http' | 'sql' | 'redis' | 'azure queue' | 'azure service bus' | 'azure blob' | 'azure table' | 'web service';
    
    export interface OperationOptions {
        readonly operationId    : string;
        readonly operationName  : string;
        
        readonly requestName?   : string;
        readonly requestUrl?    : string;
        readonly requestIp?     : string;

        readonly componentName? : string;
        readonly parentId?      : string;
    }

    export interface OperationLogger extends nova.Logger {

        readonly operationId    : string;
        authenticatedUserId?    : string;

        close(resultCode: number, success: boolean, details?: { [key: string]: string; }): void;
    }
}