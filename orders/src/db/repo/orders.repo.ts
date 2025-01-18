import { drizzle } from "drizzle-orm/node-postgres";
import { ordersTable } from "../schema/order";
import { and, eq, inArray } from "drizzle-orm";
import { OrderStatus } from "@ticketsdev10/common";


interface OrderPayload {
    ticketId: number;
    userId: number;
    status: OrderStatus;
    expiresAt: Date | null;
}

interface Order {
    id: number;
    ticketId: number;
    userId: number;
    status: string;
    expiresAt: Date | null;
    createdAt: Date | null;
}

interface OrderId {
    id: number;
}

export class OrdersRepo {

    private DB: ReturnType<typeof drizzle>;

    constructor(db: ReturnType<typeof drizzle>){
        this.DB = db;
    }


    async create(data: OrderPayload): Promise<OrderId|null> {
        try {
            
            const order = await this.DB
                .insert(ordersTable)
                .values(data)
                .returning({ id: ordersTable.id });

            return order.length > 0 ? order[0]: null

        } catch (error) {
            throw error
        }
    }



    async findOne(ticketId: number , userId: number): Promise<Order | null> {
        try {
            
            const order = await this.DB
                .select()
                .from(ordersTable)
                .where(and(eq(ordersTable.ticketId,ticketId),eq(ordersTable.userId,userId)));
            
            return order.length > 0 ? order[0] : null

        } catch (error) {
            throw error
        }
    }

    async findOneOrder(orderId: number): Promise<Order | null> {
        try {
            
            const order = await this.DB
                .select()
                .from(ordersTable)
                .where(eq(ordersTable.id,orderId));
            
            return order.length > 0 ? order[0] : null

        } catch (error) {
            throw error
        }
    }

    async updateStatusToCancel(orderId: number): Promise<void> {
        try {
            const order = await this.findOneOrder(orderId)
            if (order) {
                await this.DB
                    .update(ordersTable)
                    .set({ status: OrderStatus.Cancelled })
                    .where(eq(ordersTable.id,order.id));
            }
        } catch (error) {
            throw error
        }
    }

    async updateStatusToComplete(orderId: number): Promise<void> {
        try {
            const order = await this.findOneOrder(orderId)
            if (order) {
                await this.DB
                    .update(ordersTable)
                    .set({ status: OrderStatus.Complete })
                    .where(eq(ordersTable.id,order.id));
            }
        } catch (error) {
            throw error
        }
    }    


    async findOneTicket(ticketId: number): Promise<Order | null> {
        try {
            
            const order = await this.DB
                .select()
                .from(ordersTable)
                .where(eq(ordersTable.ticketId,ticketId));
            
            return order.length > 0 ? order[0] : null

        } catch (error) {
            throw error
        }
    }


    async checkIsReserved(ticketId: number): Promise<boolean> {
        try {
            
            const order = await this.DB
                .select()
                .from(ordersTable)
                .where(and(
                    eq(ordersTable.ticketId,ticketId),
                    inArray(
                        ordersTable.status,
                        [OrderStatus.Created,OrderStatus.AwaitingPayment,OrderStatus.Complete]
                    )

                ));

            return order.length > 0 ? true : false

        } catch (error) {
            throw error
        }
    }


    async findAll(): Promise<Order[]> {
        try {
            
            const orders = await this.DB
                .select()
                .from(ordersTable);
            
            return orders

        } catch (error) {
            throw error
        }
    }


    async delete(ticketId: number , userId: number): Promise<void> {
        try {
            
            await this.DB
                .update(ordersTable)
                .set({ status: OrderStatus.Cancelled })
                .where(and(eq(ordersTable.ticketId,ticketId),eq(ordersTable.userId,userId)));


        } catch (error) {
            throw error
        }
    }    

}