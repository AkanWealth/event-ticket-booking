import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../database/models';
import { addToWaitingList, getNextFromWaitingList } from '../services/waitingListService';
import { success } from '../../common/utils';

const { event: Event, booking: Booking } = db;

export const createEvent = async (req: Request, res: Response): Promise<Response> => {
  const { totalTickets } = req.body;

  try {
    const eventId = uuidv4();

    const newEvent = await Event.create({
      id: eventId,
      totalTickets,
      availableTickets: totalTickets,
    });

    return res.status(201).json(success("Event created successfully", newEvent));
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Failed to create event", error });
  }
};

/**
 * @swagger
 * /event/book:
 *   post:
 *     summary: Book a ticket for an event
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - userId
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: The ID of the event
 *               userId:
 *                 type: string
 *                 description: The ID of the user booking the ticket
 *     responses:
 *       200:
 *         description: Ticket booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export const bookTicket = async (req: Request, res: Response): Promise<Response> => {
  const { eventId, userId } = req.body;

  try {
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if ((event as any).availableTickets > 0) {
      await Booking.create({ eventId, userId, status: 'CONFIRMED' });
      (event as any).availableTickets--;
      await event.save();
      return res.status(200).json(success('Ticket booked successfully', { eventId, userId }));
    } else {
      await addToWaitingList(eventId, userId);
      return res.status(200).json(success('Added to waiting list', { eventId, userId }));
    }
  } catch (error) {
    console.error("Error booking ticket:", error);
    return res.status(500).json({ message: "Failed to book ticket", error });
  }
};

/**
 * @swagger
 * /event/cancel:
 *   post:
 *     summary: Cancel a ticket booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: The ID of the booking to be canceled
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export const cancelBooking = async (req: Request, res: Response): Promise<Response> => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const event = await Event.findByPk((booking as any).eventId);

    await booking.destroy();

    if (event) {
      const nextUserId = getNextFromWaitingList( (event as any).id);

      if (nextUserId && typeof nextUserId === 'number') {
        await Booking.create({ eventId: (event as any).id, userId: nextUserId.toString(), status: 'CONFIRMED' });
      } else {
        (event as any).availableTickets++;
      }

      await event.save();
    }

    return res.status(200).json(success('Booking canceled successfully', { bookingId }));
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({ message: "Failed to cancel booking", error });
  }
};

/**
 * @swagger
 * /event/bookings:
 *   get:
 *     summary: Retrieve all bookings
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: A list of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the booking
 *                       eventId:
 *                         type: string
 *                         description: The ID of the booked event
 *                       userId:
 *                         type: string
 *                         description: The ID of the user who booked the ticket
 *                       status:
 *                         type: string
 *                         description: The booking status (e.g., CONFIRMED, CANCELED)
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The booking creation date and time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The last update date and time of the booking
 */
export const getAllBookings = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Event,
          attributes: ['id', 'totalTickets', 'availableTickets'],
        },
      ],
    });

    return res.status(200).json(success('Bookings retrieved successfully', bookings));
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    return res.status(500).json({
      message: 'Failed to retrieve bookings',
      error: error.message || 'An unexpected error occurred',
    });
  }
};
