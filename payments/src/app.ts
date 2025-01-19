import express, { NextFunction } from 'express';
import promBundle from 'express-prom-bundle';
import cookieSession from 'cookie-session';
import { errorHandler, authGuard } from '@ticketsdev10/common';
import paymentsRouter from './routes';

const app = express();
// app.set('trust proxy', true)

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(
  cookieSession({
    name: 'auth-session',
    signed: false,
    secure: !(
      process.env.NODE_ENV === 'TEST' || process.env.NODE_ENV === 'DEV'
    ),
    maxAge: 15 * 60 * 1000,
  }),
);

import { tracingMiddleware } from './middlewares/tracing'; // telemetry for tracing

// prometheus-client config for metrics
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: {
    project_name: 'payments-service-monitor',
  },
  promClient: {
    collectDefaultMetrics: {},
  },
  metricsPath: '/api/payments/metrics',
});

app.use(metricsMiddleware);
app.use(tracingMiddleware);

app.get('/api/payments', (req, res) => {
  const path = {
    metrics: '/api/payments/metrics',
    health: '/api/payments/health',
    'payments All': '/api/payments/v1/',
    'create payments': '/api/payments/v1/',
  };
  res.status(200).json(path);
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.use('/api/payments/v1', authGuard, paymentsRouter);

// Not Found Handler
app.all('*', async (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'page not found',
  });
});

app.use(errorHandler);

export default app;
