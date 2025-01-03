import express, { NextFunction } from 'express';
import promBundle from "express-prom-bundle";
import cookieSession from 'cookie-session';
import { errorHandler } from './middlewares/errors';


const app = express()
// app.set('trust proxy', true)


app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

// cookie 
app.use(cookieSession({
    name: "auth-session",
    signed: false,
    secure: !(process.env.NODE_ENV === "TEST" || process.env.NODE_ENV === "DEV"),
    maxAge: 15 * 60 * 1000
}))

// logging middleware
app.use((req,res,next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start
        logger.info({
            message: "Request Processed",
            method: req.method,
            url: req.originalUrl,
            status: req.statusCode,
            responseTime: `${duration}ms`,
            headers: req.headers
        })
    })

    next();
})

import { tracingMiddleware } from './middlewares/tracing'; // telemetry for tracing

// prometheus-client config for metrics
const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
    includeUp: true,    
    customLabels: {
        project_name: 'auth-service-monitor',
    },
    promClient: {
        collectDefaultMetrics: {}
    }, 
    metricsPath: '/api/users/metrics'
});

app.use(metricsMiddleware)
app.use(tracingMiddleware)


import authRoutes from './routes/auth.routes'
import logger from './logger';
app.use("/api/users",authRoutes)

app.use(errorHandler)


export default app