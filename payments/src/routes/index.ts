import express from 'express'
import { createCharge , getAllPayments } from '../controllers';

const router = express.Router()



router.route('/')
    .post(createCharge)
    .get(getAllPayments);

export default router;