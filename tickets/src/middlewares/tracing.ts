import { Request, Response, NextFunction } from 'express';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

export const tracingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const tracer = trace.getTracer('tickets-srv');
  const currentContext = context.active();
  const span = tracer.startSpan(
    `HTTP ${req.method} ${req.path}`,
    undefined,
    currentContext,
  );

  try {
    res.on('finish', () => {
      span.setStatus({
        code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR,
      });
      span.end();
    });

    next();
  } catch (error) {
    next(error);
  }
};
