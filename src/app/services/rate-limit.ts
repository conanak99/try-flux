import { RateLimiterMemory } from "rate-limiter-flexible";

// limit of 4 requests per minute
export const limiter = new RateLimiterMemory({
  points: 4,
  duration: 60,
});

// export const limiter;
