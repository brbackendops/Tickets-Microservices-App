import {
    drizzle
} from 'drizzle-orm/node-postgres';
import {
    ticketPayloadType,
    ticketSchemaType,
    ticketUpdateType
} from '../dto/index'
import {
    ticketsTable
} from '../schema/tickets';
import {
    eq,
    sql
} from 'drizzle-orm';

interface Ticket {
    id: number;
    title: string;
    userId: number;
    price: string;
    lock: boolean;
    createdAt: Date | null;
}


export default class TicketRepo {

    private DB: ReturnType < typeof drizzle > ;

    /**
     * @param db - drizzle orm instance
    */

    constructor(db: ReturnType < typeof drizzle > ) {
        this.DB = db;
    }


    async create(payload: ticketPayloadType) {
        try {

            const ticket = await this.DB.insert(ticketsTable).values(payload)
                .returning({
                    id: ticketsTable.id,
                    title: ticketsTable.title,
                    price: ticketsTable.price
                });
            
                return ticket[0]
        } catch (error) {
            throw (error)
        }
    }

    async findOne(ticketId: number): Promise < Ticket | null > {
        try {

            const ticket = await this.DB.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId));
            return ticket.length > 0 ? ticket[0] : null

        } catch (error) {
            throw (error)
        }
    }

    async findMany(): Promise < Ticket[] > {
        try {

            const tickets = await this.DB.select().from(ticketsTable);
            return tickets

        } catch (error) {
            throw (error)
        }
    }

    async update(ticketId: number, payload: ticketUpdateType): Promise < void > {
        try {

            await this.DB.update(ticketsTable)
                .set({
                    ...payload,
                    version: sql`${ticketsTable.version} + 1`
                })
                .where(eq(ticketsTable.id, ticketId));

        } catch (error) {
            throw (error)
        }
    }

    async updateLock(ticketId: number, isLocked: boolean): Promise<void> {
        try {
            await this.DB.update(ticketsTable)
                .set({ lock: isLocked })
                .where(eq(ticketsTable.id,ticketId));
            
        } catch (error) {
            throw error
        }
    }

    async delete(ticketId: number): Promise < void > {
        try {

            await this.DB.delete(ticketsTable)
                .where(eq(ticketsTable.id, ticketId));

        } catch (error) {
            throw (error)
        }
    }
}