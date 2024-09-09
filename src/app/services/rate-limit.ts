import { RateLimiterMemory } from 'rate-limiter-flexible';

// limit of 5 requests per minute
export const limiter = new RateLimiterMemory({
  points: 5,
  duration: 50,
});
