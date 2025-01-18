import { Publisher, Subject } from "@ticketsdev10/common";

interface ExpirationCompleteEvent {
    subject: Subject.ExpirationComplete;
    data: {
        orderId: number;
    }
}

export class ExpirationCompletePublish extends Publisher<ExpirationCompleteEvent> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;    
}