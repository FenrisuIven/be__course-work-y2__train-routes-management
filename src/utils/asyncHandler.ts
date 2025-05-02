import {RequestHandler} from 'express';

type asyncHandlerProps = (...args: Parameters<RequestHandler>) => Promise<void> | void;

const asyncHandler = (func: asyncHandlerProps): RequestHandler => (
  req, res, next
) => {
  Promise.resolve(func(req, res, next))
    .catch(next)
}
export default asyncHandler;