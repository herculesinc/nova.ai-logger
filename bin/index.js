"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const applicationinsights_1 = require("applicationinsights");
const OperationLogger_1 = require("./lib/OperationLogger");
// MODULE VARIABLES
// ================================================================================================
let client;
let tags;
// PUBLIC FUNCTIONS
// ================================================================================================
function configure(options) {
    // TODO: validate options
    client = new applicationinsights_1.TelemetryClient(options.iKey);
    tags = {
        'ai.application.ver': options.appVersion,
        'ai.cloud.role': options.appName,
        'ai.cloud.roleInstance': options.appInstance
    };
}
exports.configure = configure;
// LOGGING METHODS
// --------------------------------------------------------------------------------------------
function debug(message) {
    if (typeof message !== 'string')
        throw new TypeError('Message must be a string');
    if (message === '')
        throw new TypeError('Message cannot be an empty string');
    if (!client)
        throw new Error(`Logger hasn't been configured yet`);
    client.trackTrace({
        message: message,
        severity: 0 /* Verbose */,
        tagOverrides: tags
    });
}
exports.debug = debug;
function info(message) {
    if (typeof message !== 'string')
        throw new TypeError('Message must be a string');
    if (message === '')
        throw new TypeError('Message cannot be an empty string');
    if (!client)
        throw new Error(`Logger hasn't been configured yet`);
    client.trackTrace({
        message: message,
        severity: 1 /* Information */,
        tagOverrides: tags
    });
}
exports.info = info;
function warn(message) {
    if (typeof message !== 'string')
        throw new TypeError('Message must be a string');
    if (message === '')
        throw new TypeError('Message cannot be an empty string');
    if (!client)
        throw new Error(`Logger hasn't been configured yet`);
    client.trackTrace({
        message: message,
        severity: 2 /* Warning */,
        tagOverrides: tags
    });
}
exports.warn = warn;
function error(error) {
    if (error === null || error === undefined)
        throw new TypeError('Error is undefined');
    if (error instanceof Error === false)
        throw new TypeError('Error must be an error object');
    if (!client)
        throw new Error(`Logger hasn't been configured yet`);
    client.trackException({
        exception: error,
        properties: error.details,
        tagOverrides: tags
    });
}
exports.error = error;
function track(metric, value) {
    if (typeof metric !== 'string')
        throw new TypeError('Metric name must be a string');
    if (metric === '')
        throw new TypeError('Metric name cannot be an empty string');
    if (typeof value !== 'number')
        throw new TypeError('Value must be a number');
    if (!client)
        throw new Error(`Logger hasn't been configured yet`);
    client.trackMetric({
        name: metric,
        value: value,
        tagOverrides: tags
    });
}
exports.track = track;
function startOperation(options, startTime) {
    if (!client)
        throw new Error(`Logger hasn't been configured yet`);
    return new OperationLogger_1.OperationLogger({
        client: client,
        minSeverity: 0 /* Verbose */,
        startTime: startTime || Date.now(),
        baseTags: tags
    }, options);
}
exports.startOperation = startOperation;
function flush(isAppCrashing, callback) {
    if (typeof isAppCrashing !== 'boolean')
        throw new TypeError('isAppCrashing must be a boolean');
    if (!client)
        throw new Error(`Logger hasn't been configured yet`);
    client.flush({ isAppCrashing, callback });
}
exports.flush = flush;
// EXPORTS
// =================================================================================================
var OperationLogger_2 = require("./lib/OperationLogger");
exports.OperationLogger = OperationLogger_2.OperationLogger;
//# sourceMappingURL=index.js.map