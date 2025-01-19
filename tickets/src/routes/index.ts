import express from 'express';
import {
  createTicketHandler,
  deleteTicketHandler,
  getTicketHandler,
  getTicketsHandler,
  updateTicketHandler,
} from '../controllers';

const router = express.Router();

//[GET , POST]: /api/tickets
router.route('/').get(getTicketsHandler).post(createTicketHandler);

//[GET , PUT , DELETE]: /api/tickets/:id
router
  .route('/:id')
  .get(getTicketHandler)
  .put(updateTicketHandler)
  .delete(deleteTicketHandler);

router.post('/', (req, res) => {
  res.status(201).json({
    status: 'success',
  });
});

export default router;
