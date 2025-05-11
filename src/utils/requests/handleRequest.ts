import {Request, Response} from "express";

const handleRequest = async (req: Request, res: Response, callback: Function) => {
  const responseData = await callback();
  res.status(responseData.status || 200).json(responseData.data);
}

export {handleRequest}