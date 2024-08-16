import retry from "async-await-retry";

export const retryFunc = async <T>(func: () => Promise<T>, maxRetry = 3) => {
  const result = await retry(func, undefined, {
    retriesMax: maxRetry,
    interval: 1000,
    exponential: true,
  });

  return result as T;
};
