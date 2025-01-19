import { Request, Response, NextFunction } from 'express';
import TicketRepo from '../db/repo';
import db from '../db';
import {
  TicketCreatedPublisher,
  TicketUpdatedPublisher,
} from '../events/publish/publish.types';
import { natsWrapper } from '../nats-wrapper';

export const createTicketHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const t = new TicketRepo(db);

  try {
    const body = req.body;
    body.userId = req?.user?.id;

    const newTicket = await t.create(body);
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
    });

    res.status(201).json({
      status: 'success',
      message: 'ticket successfully created',
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const t = new TicketRepo(db);

  try {
    const id = parseInt(req.params.id);
    const ticket = await t.findOne(id);

    res.status(200).json({
      status: 'success',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const t = new TicketRepo(db);

  try {
    const tickets = await t.findMany();

    res.status(200).json({
      status: 'success',
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const t = new TicketRepo(db);
  try {
    const id = parseInt(req.params.id);

    const ticket = await t.findOne(id);
    if (ticket?.userId !== req.user?.id) {
      throw new Error('resource not found');
    }

    if (ticket?.lock) {
      res.status(400).json({
        status: 'error',
        message: 'ticket is reserved',
      });
      return;
    }

    const payload = req.body;

    await t.update(id, payload);

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket?.id!,
      title: payload?.title!,
      price: payload?.price!,
    });

    res.status(200).json({
      status: 'success',
      message: 'ticket updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTicketHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const t = new TicketRepo(db);

  try {
    const id = parseInt(req.params.id);

    await t.delete(id);

    res.status(200).json({
      status: 'success',
      message: 'ticket deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
