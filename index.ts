// IMPORTS
// ================================================================================================
import { TelemetryClient, TagOverrides, SeverityLevel } from 'applicationinsights';
import { LoggerConfig, OperationOptions } from '@nova/ia-logger';
import { OperationLogger } from './lib/OperationLogger';

// MODULE VARIABLES
// ================================================================================================
let client     : TelemetryClient;
let tags       : TagOverrides;

// PUBLIC FUNCTIONS
// ================================================================================================
export function configure(options: LoggerConfig) {
    // TODO: validate options
    client = new TelemetryClient(options.iKey);
    tags = {
        'ai.application.ver'    : options.appVersion,
        'ai.cloud.role'         : options.appName,
        'ai.cloud.roleInstance' : options.appInstance
    };
}

// LOGGING METHODS
// --------------------------------------------------------------------------------------------
export function debug(message: string) {
    if (typeof message !== 'string') throw new TypeError('Message must be a string');
    if (message === '') throw new TypeError('Message cannot be an empty string');
    if (!client) throw new Error(`Logger hasn't been configured yet`);

    client.trackTrace({
        message         : message,
        severity        : SeverityLevel.Verbose,
        tagOverrides    : tags
    });
}

export function info(message: string) {
    if (typeof message !== 'string') throw new TypeError('Message must be a string');
    if (message === '') throw new TypeError('Message cannot be an empty string');
    if (!client) throw new Error(`Logger hasn't been configured yet`);

    client.trackTrace({ 
        message         : message,
        severity        : SeverityLevel.Information,
        tagOverrides    : tags
    });
}

export function warn(message: string) {
    if (typeof message !== 'string') throw new TypeError('Message must be a string');
    if (message === '') throw new TypeError('Message cannot be an empty string');
    if (!client) throw new Error(`Logger hasn't been configured yet`);

    client.trackTrace({
        message         : message,
        severity        : SeverityLevel.Warning,
        tagOverrides    : tags
    });
}

export function error(error: Error) {
    if (error === null || error === undefined) throw new TypeError('Error is undefined');
    if (error instanceof Error === false) throw new TypeError('Error must be an error object');
    if (!client) throw new Error(`Logger hasn't been configured yet`);

    client.trackException({ 
        exception       : error,
        tagOverrides    : tags
    });
}

export function track(metric: string, value: number) {
    if (typeof metric !== 'string') throw new TypeError('Metric name must be a string');
    if (metric === '') throw new TypeError('Metric name cannot be an empty string');
    if (typeof value !== 'number') throw new TypeError('Value must be a number');
    if (!client) throw new Error(`Logger hasn't been configured yet`);

    client.trackMetric({
        name            : metric,
        value           : value,
        tagOverrides    : tags
    });
}

export function startOperation(options: OperationOptions, startTime?: number): OperationLogger {
    if (!client) throw new Error(`Logger hasn't been configured yet`);
    
    return new OperationLogger({
        client      : client,
        minSeverity : SeverityLevel.Verbose,    // TODO: calculate based on log leve
        startTime   : startTime || Date.now(),
        baseTags    : tags
    }, options);
}

export function flush(isAppCrashing: boolean, callback?: (message: string) => void) {
    if (typeof isAppCrashing !== 'boolean') throw new TypeError('isAppCrashing must be a boolean');
    if (!client) throw new Error(`Logger hasn't been configured yet`);
    client.flush({ isAppCrashing, callback })
}

// EXPORTS
// =================================================================================================
export { OperationLogger } from './lib/OperationLogger';