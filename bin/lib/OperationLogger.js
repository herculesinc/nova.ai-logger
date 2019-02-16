"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CLASS DEFINITION
// =================================================================================================
class OperationLogger {
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(config, options) {
        // TODO: validate options
        this.client = config.client;
        this.operationId = options.operationId;
        this.operationName = options.operationName;
        this.componentName = options.componentName;
        this.requestName = options.requestName || this.operationName;
        this.requestUrl = options.requestUrl,
            this.startTime = config.startTime;
        this.tags = Object.assign({}, config.baseTags, { 'ai.operation.id': options.operationId, 'ai.operation.name': this.operationName, 'ai.operation.parentId': options.parentId, 'ai.location.ip': options.requestIp, 'ai.cloud.role': this.componentName });
        this.minSeverity = config.minSeverity;
    }
    // PUBLIC PROPERTIES
    // --------------------------------------------------------------------------------------------
    get authenticatedUserId() {
        return this.tags['ai.user.authUserId'];
    }
    set authenticatedUserId(value) {
        this.tags['ai.user.authUserId'] = value;
    }
    get isClosed() {
        return (this.client !== undefined);
    }
    // LOGGING METHODS
    // --------------------------------------------------------------------------------------------
    debug(message) {
        if (!this.client)
            throw new Error('Operation has already been closed');
        if (this.minSeverity > 0 /* Verbose */)
            return;
        this.client.trackTrace({
            message: message,
            severity: 0 /* Verbose */,
            tagOverrides: this.tags
        });
    }
    info(message) {
        if (!this.client)
            throw new Error('Operation has already been closed');
        if (this.minSeverity > 1 /* Information */)
            return;
        this.client.trackTrace({
            message: message,
            severity: 1 /* Information */,
            tagOverrides: this.tags
        });
    }
    warn(message) {
        if (!this.client)
            throw new Error('Operation has already been closed');
        if (this.minSeverity > 2 /* Warning */)
            return;
        this.client.trackTrace({
            message: message,
            severity: 2 /* Warning */,
            tagOverrides: this.tags
        });
    }
    error(error) {
        if (!this.client)
            throw new Error('Operation has already been closed');
        this.client.trackException({
            exception: error,
            properties: error.details,
            tagOverrides: this.tags
        });
    }
    trace(source, command, duration, success) {
        if (!this.client)
            throw new Error('Operation has already been closed');
        if (success && this.minSeverity > 1 /* Information */)
            return;
        // TODO: validate parameters
        if (typeof command === 'string') {
            command = { name: command };
        }
        this.client.trackDependency({
            dependencyTypeName: source.type,
            target: source.name,
            name: command.name,
            data: command.text || command.name,
            duration: duration,
            resultCode: success ? 0 : 1,
            success: success,
            tagOverrides: this.tags
        });
    }
    close(resultCode, success, properties) {
        if (!this.client)
            throw new Error('Operation has already been closed');
        // TODO: validate parameters
        const telemetry = {
            name: this.requestName,
            url: this.requestUrl,
            duration: Date.now() - this.startTime,
            resultCode: resultCode,
            success: success,
            tagOverrides: this.tags,
            properties: properties
        };
        this.client.trackRequest(telemetry);
        this.client = undefined;
    }
}
exports.OperationLogger = OperationLogger;
//# sourceMappingURL=OperationLogger.js.map