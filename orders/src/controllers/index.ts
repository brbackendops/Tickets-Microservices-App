import { Response , Request ,NextFunction } from "express";
import { OrdersRepo } from "../db/repo/orders.repo";
import db from "../db";
import { ExistsError , OrderStatus } from "@ticketsdev10/common";
import { OrderCancelledPublisher, OrderCreatedPublisher } from "../events/publish/publish.types";
import { natsWrapper } from "../nats-wrapper";
import { TicketRepo } from "../db/repo/ticket.repo";
import logger from "../logger";


export const createOrder = async(req: Request,res: Response,next: NextFunction): Promise<void> => {
    const orderRepo = new OrdersRepo(db);
    const ticketRepo = new TicketRepo(db);
    const EXPIRATION_WINDOW_SIZE = 15 * 60;
    try {
        const { ticketId } = req.body;
        
        const ticket = await ticketRepo.findOne(ticketId)

        if (!ticket) {
            logger.info(`ticket with id ${ticketId} is not found`)
            res.status(400).json({
                status: "failed",
                message: "ticket not found"
            })
            return;
        }

        const isReserved = await orderRepo.checkIsReserved(ticketId)
        logger.info(`checking ticket with id ${ticketId} is either reserved or not`)
        if (isReserved) {
            logger.info(`ticket with id ${ticketId} is reserved`)
            res.status(400).json({
                status: "failed",
                message: "ticket already reserved"
            })
            return;
        }

        const expirationTime = new Date()
        expirationTime.setSeconds(expirationTime.getSeconds() * EXPIRATION_WINDOW_SIZE)
        logger.info(`successfully configured expiration time for ticket with id ${ticketId}`)
        const data = {
            ticketId: ticketId,
            userId: parseInt(req.user?.id!),
            status: OrderStatus.Created,
            expiresAt: expirationTime
        }

        const order = await orderRepo.create(data)
        new OrderCreatedPublisher(natsWrapper.client).publish({
            orderId: order?.id!,
            ticketId: data.ticketId,
            userId: data.userId,
            status: OrderStatus.Created,
            expiresAt: expirationTime.toISOString(),
        });
        logger.info(`order created event successfully published for ticket with id ${ticketId}`)

        logger.info(`order successfully created for ticket with id ${ticketId}`)
        res.status(201).json({
            status: "success",
            message: "order successfully created"
        })

    } catch (error) {
        logger.error(`error from: order-create-controller: error-was ${error}`)
        next(error)
    }
}


export const getOrder = async(req: Request,res: Response,next: NextFunction): Promise<void> => {
    const orderRepo = new OrdersRepo(db);
    try {
        
        const id = parseInt(req.params.id);
        const ticketId = parseInt(req.params.ticketId)
        const order = await orderRepo.findOne(ticketId,id)

        if (!order) {
            logger.info(`ticket with id ${ticketId} is not found`)
            res.status(404).json({
                status: "error",
                message: "order not found"
            });
            return;
        }

        logger.info(`ticket with id ${ticketId} is successfully received`)
        res.status(200).json({
            status: "success",
            data: order
        })

    } catch (error) {
        logger.info(`get one tickets ends in  ${error}`)
        next(error)
    }
}



export const getAllOrder = async(req: Request,res: Response,next: NextFunction): Promise<void> => {
    const orderRepo = new OrdersRepo(db);
    try {
        
        const orders = await orderRepo.findAll()
        res.status(200).json({
            status: "success",
            data: orders
        });

        logger.info(`get all tickets was successfull`)
        return;

    } catch (error) {
        logger.info(`get all tickets ends in error ${error}`)
        next(error)
    }
}


export const deleteOrder = async(req: Request,res: Response,next: NextFunction): Promise<void> => {
    const orderRepo = new OrdersRepo(db);
    try {
        
        const id = parseInt(req.params.id);
        const ticketId = parseInt(req.params.ticketId);
        const order = await orderRepo.findOne(ticketId,id);

        if (!order) {
            logger.info(`order for ticket ${ticketId} not found`)
            res.status(404).json({
                status: "error",
                message: "order not found"
            });
            return;
        }

        await orderRepo.delete(ticketId,order.id)

        new OrderCancelledPublisher(natsWrapper.client).publish({
            orderId: order?.id!,
            ticketId: ticketId,
            userId: parseInt(req?.user?.id!),
            status: OrderStatus.Cancelled,
        });

        logger.info(`ticket cancelling event send successfully`)

        res.status(200).json({
            status: "success",
            message: "order successfully deleted"
        });

        logger.info(`order successfully cancelled for ticket ${ticketId}`)
        return;

    } catch (error) {
        logger.info(`cancelling a ticket ends in error ${error}`)
        next(error)
    }
}
