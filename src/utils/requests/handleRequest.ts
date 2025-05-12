import {Request, Response} from "express";

const handleRequest = (callback: (req: Request) => Promise<any>) => {
  return async (req: Request, res: Response) => {
    const responseData = await callback(req);
    res.status(responseData.status || 200).json(responseData.data);
  }
}

export {handleRequest}