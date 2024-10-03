import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import eventRouter from './routes/eventRoutes';

const router = Router();

// Set up rate limiter: maximum of 10 requests per minute
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Apply the rate limiter to /api route
router.get('/api', apiLimiter, async (req, res) => {
  return res.json({
    status: true,
    message: 'Test API limiter',
  });
});

router.use('/events', eventRouter);

// A general route for all other requests
router.use('/', async (req, res) => {
  return res.send('successful 2s');
});


export default router;
