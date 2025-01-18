import { drizzle } from "drizzle-orm/node-postgres";
import { ticketsTable } from "../schema/tickets";
import { Subject } from "@ticketsdev10/common";
import logger from "../../logger";
import { eq } from "drizzle-orm";
import { ordersTable } from "../schema/order";


interface ticketDataI {
    ticketId: number;
    title: string;
    price: string;
}

interface ticketDataUpdateI {
    title: string;
    price: string;
}


export class TicketRepo {

    private DB: ReturnType<typeof drizzle>;

    constructor(db: ReturnType<typeof drizzle>){
        this.DB = db;
    }

    async create(ticketData: ticketDataI): Promise<void> {
        try {
            await this.DB.insert(ticketsTable).values(ticketData)
            logger.info("new ticket is created in order service");
        } catch (error: any) {
            logger.error(`error-ticket-order: error in creating ticket in order service ${error}`)
            throw error
        }
    }

    async findOne(ticketId: number): Promise<ticketDataI | null>{
        try {
            
            const order = await this.DB
                .select()
                .from(ticketsTable)
                .where(eq(
                    ticketsTable.ticketId , ticketId
                ));
            
            return order.length > 0 ? order[0]: null

        } catch (error) {
            throw error
        }
    }

    async update(ticketData: ticketDataUpdateI , ticketId: number): Promise<void> {
        try {
            await this.DB.update(ticketsTable)
                .set(ticketData)
                .where(eq(ticketsTable.ticketId,ticketId));

                logger.info("ticket is updated in order service");
        } catch (error) {
            logger.error(`error-ticket-update-order: error in updating ticket in order service ${error}`)
            throw error
        }
    }

}    
