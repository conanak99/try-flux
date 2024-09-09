import { BentoCache, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';

export const bento = new BentoCache({
  default: 'cache',
  stores: {
    // A first cache store named "cache" using
    // only L1 in-memory cache

    // Reduce cache size in development
    cache: bentostore().useL1Layer(
      memoryDriver({
        maxSize: 100_000_000, // 100 MB
      })
    ),
  },
});
