import { paymentsTable } from './../schema/payments';
import { drizzle } from 'drizzle-orm/node-postgres';

interface PaymentsPayload {
  orderId: number;
  stripeId: string;
}

export class PaymentsRepo {
  private DB: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.DB = db;
  }

  async create(payload: PaymentsPayload): Promise<{ id: number } | null> {
    try {
      const payment = await this.DB.insert(paymentsTable)
        .values(payload)
        .returning({ id: paymentsTable.id });

      return payment.length > 0 ? payment[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<PaymentsPayload[]> {
    try {
      const payments = await this.DB.select().from(paymentsTable);
      return payments;
    } catch (error) {
      throw error;
    }
  }
}
