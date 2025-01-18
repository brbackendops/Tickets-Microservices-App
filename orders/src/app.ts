import express, { NextFunction } from 'express';
import promBundle from "express-prom-bundle";
import cookieSession from 'cookie-session';
import { errorHandler , authGuard } from '@ticketsdev10/common';
import ordersRouter from './routes';

const app = express()
// app.set('trust proxy', true)


app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

app.use(cookieSession({
    name: "auth-session",
    signed: false,
    secure: !(process.env.NODE_ENV === "TEST" || process.env.NODE_ENV === "DEV"),
    maxAge: 15 * 60 * 1000,
}));

import { tracingMiddleware } from './middlewares/tracing'; // telemetry for tracing

// prometheus-client config for metrics
const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
    includeUp: true,    
    customLabels: {
        project_name: 'orders-service-monitor',
    },
    promClient: {
        collectDefaultMetrics: {}
    },
    metricsPath: '/api/orders/metrics'
});

app.use(metricsMiddleware)
app.use(tracingMiddleware)


app.get("/api/orders", (req,res) => {
    const path = {
        "metrics": '/api/orders/metrics',
        "health": "/api/orders/health",
        "orders All": "/api/orders/v1/",
        "orders single": "/api/orders/v1/:id",
        "create orders": "/api/orders/v1/",
        "update orders": "/api/orders/v1/:id"
    }
    res.status(200).json(path)
})

app.get("/health",(req,res) => {
    res.send("OK")
});

app.use('/api/orders/v1',authGuard,ordersRouter);


// Not Found Handler
app.all('*', async (req,res) => {
    res.status(404).json({
        status: "error",
        message: "page not found"
    })
});

app.use(errorHandler)


export default app