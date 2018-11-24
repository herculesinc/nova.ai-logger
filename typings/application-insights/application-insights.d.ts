declare module 'applicationinsights' {

    // TELEMETRY TYPES
    // --------------------------------------------------------------------------------------------
    export interface Telemetry {
        time?               : Date;        
        properties?         : { [key: string]: string; };
        contextObjects?     : { [name: string]: any; };
        tagOverrides?       : TagOverrides;
    }
 
    export interface EventTelemetry extends Telemetry {
        name                : string;
        measurements?       : { [key: string]: number; };
    }

    export interface MetricTelemetry extends Telemetry {
        name                : string;
        value               : number;
        count?              : number;
        min?                : number;
        max?                : number;
        stdDev?             : number;
    }

    export interface ExceptionTelemetry extends Telemetry {
        exception           : Error;
        measurements?       : { [key: string]: number; };
    }

    export interface DependencyTelemetry extends Telemetry {
        dependencyTypeName  : string;
        target?             : string;
        name                : string;
        data                : string;
        duration            : number;
        resultCode          : string | number;
        success             : boolean;
    }

    export interface RequestTelemetry extends Telemetry {
        name                : string;
        url?                : string;
        source?             : string;
        duration            : number;
        resultCode          : string | number;
        success             : boolean;
    }

    export const enum SeverityLevel {
        Verbose = 0, Information = 1, Warning = 2, Error = 3, Critical = 4
    }

    export interface TraceTelemetry extends Telemetry {
        message             : string;
        severity?           : SeverityLevel;
    }

    // CLIENTS
    // --------------------------------------------------------------------------------------------
    export interface FlushOptions {
        isAppCrashing?      :boolean
        callback?           : (v: string) => void;
    }

    export interface TelemetryClientConfig {
        maxBatchSize        : number;   // default 250
        maxBatchIntervalMs  : number;   // default 15000
        samplingPercentage  : number;   // default 100
    }

    export class TelemetryClient  {

        constructor(ikey?: string);

        trackTrace(telemetry: TraceTelemetry): void;
        trackMetric(telemetry: MetricTelemetry): void;
        trackEvent(telemetry: EventTelemetry): void;
        trackException(telemetry: ExceptionTelemetry): void;
        trackRequest(telemetry: RequestTelemetry): void;
        trackDependency(telemetry: DependencyTelemetry): void;

        flush(options?: FlushOptions): void;
    }

    // CONTEXT TAGS
    // --------------------------------------------------------------------------------------------
    export type ContextTag =
        'ai.application.ver' |
        'ai.device.id' |
        'ai.device.locale' |
        'ai.device.model' |
        'ai.device.oemName' |
        'ai.device.osVersion' |
        'ai.device.type' |
        'ai.location.ip' |
        'ai.operation.id' |
        'ai.operation.name' |
        'ai.operation.parentId' |
        'ai.operation.syntheticSource' |
        'ai.operation.correlationVector' |
        'ai.session.id' |
        'ai.session.isFirst' |
        'ai.user.accountId' |
        'ai.user.id' |
        'ai.user.authUserId' |
        'ai.cloud.role' |
        'ai.cloud.roleInstance' |
        'ai.internal.sdkVersion' |
        'ai.internal.agentVersion' |
        'ai.internal.nodeName';

    export type TagOverrides = { [Tag in ContextTag]?: string; };
}