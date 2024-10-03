import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../database/models';
import { addToWaitingList, getNextFromWaitingList } from '../services/waitingListService';
const { event: Event, booking: Booking } = db;

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<Response> => {
  const { totalTickets } = req.body;

  try {
    // Generate a unique eventId
    const eventId = uuidv4();

    const event = await Event.create({
      id: eventId,                // Setting the generated eventId
      totalTickets,
      availableTickets: totalTickets,
    });

    // Return the eventId along with the event details
    return res.status(201).json({
      message: "Event created successfully",
      eventId: event.id,          // Returning the eventId
      totalTickets: event.totalTickets,
      availableTickets: event.availableTickets,
    });
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
  const selectedEvent = await Event.findByPk(eventId);

  if (!selectedEvent) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (selectedEvent.availableTickets > 0) {
    await Booking.create({ eventId, userId, status: 'CONFIRMED' });
    selectedEvent.availableTickets--;
    await selectedEvent.save();
    return res.status(200).json({ message: 'Ticket booked' });
  } else {
    addToWaitingList(eventId, userId);
    return res.status(200).json({ message: 'Added to waiting list' });
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
  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  await booking.destroy();
  const selectedEvent = await Event.findByPk(booking.eventId);

  if (selectedEvent) {
    const eventId = selectedEvent.id; // Store the eventId in a variable
    const nextUserId = getNextFromWaitingList(eventId);

    // Ensure nextUserId is a string before using it
    if (nextUserId && typeof nextUserId === 'number') {
      await Booking.create({ eventId: eventId, userId: nextUserId.toString(), status: 'CONFIRMED' });
    } else {
      selectedEvent.availableTickets++;
    }

    await selectedEvent.save();
  }

  return res.status(200).json({ message: 'Booking canceled' });
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
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await db.Booking.findAll({
      include: [
        {
          model: db.Event, // Ensure this is defined in your models
          attributes: ['id', 'totalTickets', 'availableTickets'], // Attributes to return
        },
        // {
        //   model: db.User, // Ensure this is defined in your models
        //   attributes: ['id', 'name'], // Attributes to return
        // },
      ],
    });

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    return res.status(500).json({
      message: 'Failed to retrieve bookings',
      error: error.message,
    });
  }
};
