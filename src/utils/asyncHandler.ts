import {RequestHandler} from 'express';

type a = (...args: Parameters<RequestHandler>) => Promise<void> | void;

const asyncHandler = (func: a): RequestHandler => (
  req, res, next
) => {
  Promise.resolve(func(req, res, next))
    .catch(next)
}
export default asyncHandler;