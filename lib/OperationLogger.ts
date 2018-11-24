// IMPORTS
// =================================================================================================
import { TelemetryClient, SeverityLevel, TagOverrides } from 'applicationinsights';
import { TraceSource, TraceCommand, OperationOptions } from '@nova/ia-logger';

// INTERFACES
// =================================================================================================
export interface OperationConfig {
    readonly client         : TelemetryClient;
    readonly minSeverity    : SeverityLevel;
    readonly startTime      : number;
    readonly baseTags       : TagOverrides;
}

// CLASS DEFINITION
// =================================================================================================
export class OperationLogger {
    readonly operationId        : string;
    readonly operationName      : string;
    readonly componentName?     : string;

    private readonly requestName: string;
    private readonly requestUrl?: string;

    private client              : TelemetryClient;
    private readonly tags       : TagOverrides;
    private readonly minSeverity: SeverityLevel;
    private readonly startTime  : number;

    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(config: OperationConfig, options: OperationOptions) {
        // TODO: validate options

        this.client = config.client;
        
        this.operationId = options.operationId;
        this.operationName = options.operationName;
        this.componentName = options.componentName;

        this.requestName = options.requestName || this.operationName;
        this.requestUrl = options.requestUrl,
        this.startTime = config.startTime;

        this.tags = { ...config.baseTags,
            'ai.operation.id'       : options.operationId,
            'ai.operation.name'     : this.operationName,
            'ai.operation.parentId' : options.parentId,
            'ai.location.ip'        : options.requestIp,
            'ai.cloud.role'         : this.componentName
        };
    }

    // PUBLIC PROPERTIES
    // --------------------------------------------------------------------------------------------
    get authenticatedUserId(): string {
        return this.tags['ai.user.authUserId'];
    }

    set authenticatedUserId(value: string) {
        this.tags['ai.user.authUserId'] = value;
    }

    get isClosed(): boolean {
        return (this.client !== undefined);
    }

    // LOGGING METHODS
    // --------------------------------------------------------------------------------------------
    debug(message: string) {
        if (!this.client) throw new Error('Operation has already been closed');
        if (this.minSeverity > SeverityLevel.Verbose) return;
        this.client.trackTrace({
            message         : message,
            severity        : SeverityLevel.Verbose,
            tagOverrides    : this.tags
        });
    }

    info(message: string) {
        if (!this.client) throw new Error('Operation has already been closed');
        if (this.minSeverity > SeverityLevel.Information) return;
        this.client.trackTrace({ 
            message         : message,
            severity        : SeverityLevel.Information,
            tagOverrides    : this.tags
        });
    }

    warn(message: string) {
        if (!this.client) throw new Error('Operation has already been closed');
        if (this.minSeverity > SeverityLevel.Warning) return;
        this.client.trackTrace({
            message         : message,
            severity        : SeverityLevel.Warning,
            tagOverrides    : this.tags
        });
    }

    error(error: Error) {
        if (!this.client) throw new Error('Operation has already been closed');
        this.client.trackException({ 
            exception       : error,
            tagOverrides    : this.tags
        });
    }

    trace(source: TraceSource, command: TraceCommand, duration: number, success: boolean) {
        if (!this.client) throw new Error('Operation has already been closed');
        if (success && this.minSeverity > SeverityLevel.Information) return;
        // TODO: validate parameters
        this.client.trackDependency({
            dependencyTypeName  : source.type,
            target              : source.name,
            name                : command.name,
            data                : command.text,
            duration            : duration,
            resultCode          : success ? 0 : 1,
            success             : success,
            tagOverrides        : this.tags
        });
    }

    close(resultCode: number, success: boolean, properties?: { [key: string]: string; }) {
        if (!this.client) throw new Error('Operation has already been closed');
        // TODO: validate parameters
        const telemetry = {
            name            : this.requestName,
            url             : this.requestUrl,
            duration        : Date.now() - this.startTime,
            resultCode      : resultCode,
            success         : success,
            tagOverrides    : this.tags,
            properties      : properties
        };
        this.client.trackRequest(telemetry);
        this.client = undefined;
    }
}