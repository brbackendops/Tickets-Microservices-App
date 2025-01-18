import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {  } from '@opentelemetry/core';
import logger from './logger';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';


const serviceName = "payments-srv"
const version = "1.0"

const zipkinExporter = new ZipkinExporter({
    serviceName: serviceName,
    url: process.env.TRACING_URL,
    headers: {
        'Content-Type': "application/json",
        'Service-Name': serviceName
    },
    statusCodeTagName: "http.status_code"
})

const sdk = new NodeSDK({
    resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: version
    }),
    spanProcessors: [
        new BatchSpanProcessor(zipkinExporter)
    ],
    instrumentations: [
        getNodeAutoInstrumentations(),
        new HttpInstrumentation(),
        new ExpressInstrumentation()
    ]
});

sdk.start()

logger.info("tracing from open telemetry has been started for tickets-srv")

process.on('SIGTERM', () => {
    sdk.shutdown()
    logger.warn("shutdown tracing is successfull")
});
