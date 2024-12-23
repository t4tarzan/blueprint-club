import { LRUCache } from 'lru-cache';
import type { NextApiResponse } from 'next';

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitResponse {
  check: (res: NextApiResponse, limit: number, token: string) => Promise<void>;
}

export function rateLimit(options: RateLimitOptions): RateLimitResponse {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: async (res: NextApiResponse, limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage >= limit;

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);

      if (isRateLimited) {
        throw new Error('Rate limit exceeded');
      }
    },
  };
}
