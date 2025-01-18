import express from 'express'
import { OrderPayloadSchema } from '../db/dto';
import { schemeValidator } from '@ticketsdev10/common';
import { createOrder , getOrder , getAllOrder, deleteOrder } from '../controllers/index'

const router = express.Router()


router.route('/')
    .get(getAllOrder)
    .post(schemeValidator(OrderPayloadSchema),createOrder)

router.route('/:id/:ticketId')
    .get(getOrder)
    .delete(deleteOrder);

export default router;