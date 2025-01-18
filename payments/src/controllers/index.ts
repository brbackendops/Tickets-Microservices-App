import { Response, Request ,NextFunction } from 'express';
import { stripe } from '../stripe';
import { OrdersRepo } from '../db/repo/orders.repo';
import db from '../db';
import { OrderStatus } from '@ticketsdev10/common';
import { PaymentsRepo } from '../db/repo/payments.repo';
import { PaymentCreatedPublisher } from '../events/publishers/payment.create.pub';
import { natsWrapper } from '../nats-wrapper';


export const createCharge = async (req: Request, res: Response,next: NextFunction) => {
    const orderRepo = new OrdersRepo(db)
    const paymentsRepo = new PaymentsRepo(db)
    try {
        const { orderId , token } = req.body;

        // find order with order id
        const order = await orderRepo.findOne(orderId)

        // check order exists
        if (!order) {
            res.status(404).json({
                status: "error",
                message: "order not found"
            });
            return;
        }

        // check the current user is initiated the payment or not , if not throw error
        if (order?.userId != parseInt(req.user?.id!)) {
            res.status(404).json({
                status: "error",
                message: "order not found"
            });
            return;
        }

        // check status of order is either cancelled or not , if cancelled throw error
        if (order.status == OrderStatus.Cancelled) {
            res.status(400).json({
                status: "error",
                message: "order cancelled"
            });
            return;
        }


        // create stripe charge
        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: parseFloat(order.price) * 100,
            description: "payment for ticket:order:",
            source: token,
        });


        // save the data into db with charge.id

        await paymentsRepo.create({
            orderId,
            stripeId: charge.id
        })

        // publish payment created event

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            orderId,
            stripeId: charge.id
        })

        //done: define payment created listener on orders

        //done: define expiration complete event on orders

        res.status(201).json({
            status: "success",
            message: "payment for this order has been completed successfully"
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getAllPayments = async ( req: Request , res: Response , next: NextFunction): Promise<void> => {
    const paymentsRepo = new PaymentsRepo(db)

    try {        
        const payments = await paymentsRepo.findAll()

        res.status(200).json({
            status: "success",
            data: payments
        })

    } catch (error) {
        next(error)
    }
}