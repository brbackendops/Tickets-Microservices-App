import { Publisher, Subject } from '@ticketsdev10/common';

interface paymentCreatedEvent {
  subject: Subject.OrderComplete;
  data: {
    orderId: number;
    stripeId: string;
  };
}

export class PaymentCreatedPublisher extends Publisher<paymentCreatedEvent> {
  subject: Subject.OrderComplete = Subject.OrderComplete;
}
