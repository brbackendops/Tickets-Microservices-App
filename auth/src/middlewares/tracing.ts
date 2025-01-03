import {
  trace,
  context,
  SpanStatusCode
} from '@opentelemetry/api';
import {
  NextFunction,
  Request,
  Response
} from 'express';


export const tracingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  
  const tracer = trace.getTracer('auth-srv');
  const currentContext = context.active()

  const span = tracer.startSpan(`HTTP ${req.method} ${req.path}`, undefined, currentContext);

  context.with(trace.setSpan(currentContext, span), () => {
    try {

      res.on('finish', () => {
        span.setStatus({
          code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR
        })
        span.end()
      })

      next();
    } catch (error) {
      next(error)
    }

  })

}