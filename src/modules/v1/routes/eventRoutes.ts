import { Router } from 'express';
import { bookTicket, cancelBooking, createEvent, getAllBookings } from '../controllers/eventController';

const eventRouter = Router();

// Define the event-related routes
eventRouter.post('/create', createEvent);
// eventRouter.post('/initialize', initializeEvent);
eventRouter.post('/book', bookTicket);
eventRouter.post('/cancel', cancelBooking);
eventRouter.get('/event/bookings', getAllBookings);

export default eventRouter;
