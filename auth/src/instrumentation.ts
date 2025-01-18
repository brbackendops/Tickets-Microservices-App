import 'dotenv/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources'
import { 
    ATTR_SERVICE_NAME , 
    ATTR_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import logger from './logger';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';

import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const serviceName = 'auth-srv';
const serviceVersion = '1.0';

const zipkinExporter = new ZipkinExporter({
        serviceName,
        url: process.env.TRACING_URL,
        headers: {
            'Content-Type': 'application/json',
            'Service-Name': serviceName
        },
        statusCodeTagName: 'http.status_code',
})


const sdk = new NodeSDK({
    resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: serviceVersion
    }),
    // traceExporter: zipkinExporter,
    spanProcessor: new BatchSpanProcessor(zipkinExporter,{
        scheduledDelayMillis: 100,
        maxQueueSize:1,
        maxExportBatchSize: 1
    }),
    instrumentations: [
        getNodeAutoInstrumentations(),
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
    ]
})

sdk.start()

logger.info(`OpenTelemetry SDK started, sending traces to Zipkin from ${serviceName}`);
console.log(`OpenTelemetry SDK started, sending traces to Zipkin from ${serviceName}`);

process.on('SIGTERM', () => {
    sdk.shutdown()
    zipkinExporter.shutdown()
});