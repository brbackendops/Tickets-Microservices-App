import { OrderStatus, Subject } from '@ticketsdev10/common';
// import { natsWrapper } from "../../__mocks__/nats-wrapper";

jest.mock('../publish/publish.types');

interface TicketUpdatedEvent {
  subject: Subject.TickerUpdated;
  data: {
    id: number;
    title: string;
    price: string;
  };
}

const setup = async () => {
  const publish = jest
    .fn()
    .mockImplementation(async (data: TicketUpdatedEvent['data']) => {
      return null;
    });

  const ticketPublisher = {
    subject: Subject.TickerUpdated,
    publish: publish,
  };

  const ticket = {
    id: 1,
    title: 'test',
    price: '0.00',
  };

  return {
    ticketPublisher,
    ticket,
  };
};

describe('order created publisher test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should publish data with subject called order:create', async () => {
    const { ticketPublisher, ticket } = await setup();
    ticketPublisher.publish(ticket);

    expect(ticketPublisher.subject).toBe(Subject.TickerUpdated);
    expect(ticketPublisher.publish).toHaveBeenCalled();
  });
});
