import {RequestHandler} from 'express';

const resolveRequest = <T>(callback: RequestHandler<T>): RequestHandler<T> => {
  return (req, res, next) => {
    Promise.resolve(callback(req, res, next)).catch(next)
  }
}

export default resolveRequest;