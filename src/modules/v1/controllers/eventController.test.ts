import request from 'supertest';
import express from 'express';
import db from '../../../database/models';
import { bookTicket, cancelBooking, createEvent, getAllBookings } from './eventController';

// Create an instance of an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Setup routes for testing
app.post('/event', createEvent);
app.post('/event/book', bookTicket);
app.post('/event/cancel', cancelBooking);
app.get('/event/bookings', getAllBookings);

// Mocking the db models
jest.mock('../../../database/models', () => ({
  event: {
    create: jest.fn(),
    findByPk: jest.fn(),
    save: jest.fn(),
  },
  booking: {
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
  },
}));

const { event: Event, booking: Booking } = db;

describe('Event Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it('should create an event successfully', async () => {
    const totalTickets = 100;
    const newEvent = { id: 'event-id', totalTickets, availableTickets: totalTickets };

    (Event.create as jest.Mock).mockResolvedValue(newEvent);
  
    const response = await request(app).post('/event').send({ totalTickets });
  
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Event created successfully");
    expect(response.body.data).toEqual(newEvent);
  });

  it('should fail to create an event on error', async () => {
    (Event.create as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).post('/event').send({ totalTickets: 100 });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to create event");
  });

  it('should book a ticket successfully', async () => {
    const eventId = 'event-id';
    const userId = 'user-id';
    const event = { id: eventId, availableTickets: 1, save: jest.fn() }; // Mock instance with save method
    const bookingData = { eventId, userId, status: 'CONFIRMED' };
  
    (Event.findByPk as jest.Mock).mockResolvedValue(event);
    (Booking.create as jest.Mock).mockResolvedValue(bookingData);
  
    const response = await request(app).post('/event/book').send({ eventId, userId });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Ticket booked successfully');
    expect(event.save).toHaveBeenCalled(); // Ensure save was called
  });

  it('should return not found when booking a ticket for a non-existing event', async () => {
    const eventId = 'non-existing-event-id';
    const userId = 'user-id';

    (Event.findByPk as jest.Mock).mockResolvedValue(null); // No event found

    const response = await request(app).post('/event/book').send({ eventId, userId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found');
  });

  it('should cancel a booking successfully', async () => {
    const bookingId = 'booking-id';
    const booking = { id: bookingId, eventId: 'event-id', destroy: jest.fn() }; // Mock instance with destroy method
    const event = { id: 'event-id', availableTickets: 0, save: jest.fn() }; // Mock instance with save method
  
    (Booking.findByPk as jest.Mock).mockResolvedValue(booking);
    (Event.findByPk as jest.Mock).mockResolvedValue(event);
    
    const response = await request(app).post('/event/cancel').send({ bookingId });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Booking canceled successfully');
    expect(booking.destroy).toHaveBeenCalled(); // Ensure destroy was called
  });

  it('should return not found when canceling a non-existing booking', async () => {
    const bookingId = 'non-existing-booking-id';

    (Booking.findByPk as jest.Mock).mockResolvedValue(null); // No booking found

    const response = await request(app).post('/event/cancel').send({ bookingId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Booking not found');
  });

  it('should retrieve all bookings successfully', async () => {
    const bookings = [{ id: 'booking-id', eventId: 'event-id', userId: 'user-id', status: 'CONFIRMED' }];

    (Booking.findAll as jest.Mock).mockResolvedValue(bookings);

    const response = await request(app).get('/event/bookings');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Bookings retrieved successfully');
    expect(response.body.data).toEqual(bookings);
  });

  it('should handle error while retrieving bookings', async () => {
    (Booking.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/event/bookings');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to retrieve bookings');
  });
});