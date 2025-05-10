import {RequestHandler} from 'express';

type handlerProps = (...args: Parameters<RequestHandler>) => Promise<void> | void;

const resolveRequest = (func: handlerProps): RequestHandler => (
  req, res, next
) => {
  Promise.resolve(func(req, res, next))
    .catch(next)
}
export default resolveRequest;