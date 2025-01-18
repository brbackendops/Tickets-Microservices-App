
import { Publisher, Subject } from '@ticketsdev10/common'


interface TicketCreatedI {
    subject: Subject.TicketCreated,
    data: {
        id: number;
        title: string;
        price: string;
    }
}



interface TicketUpdatedI {
    subject: Subject.TickerUpdated,
    data: {
        id: number;
        title: string;
        price: string;
    }
}


export class TicketCreatedPublisher extends Publisher<TicketCreatedI> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
}

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedI> {
    subject: Subject.TickerUpdated = Subject.TickerUpdated;
}