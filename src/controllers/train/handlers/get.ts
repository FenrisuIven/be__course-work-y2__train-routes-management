import {NextFunction, Request, Response} from "express";

import TrainModel from "../../../models/train";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  let include = {};
  if (req.query.include || Array.isArray(req.query.include)) {
    include = {
      voyage: (req.query.include as string[]).includes("voyage"),
      tracker: (req.query.include as string[]).includes("tracker"),
    };
  }

  let responseData = [];
  if (Object.keys(include).length > 0) {
    responseData = await TrainModel.GET_ALL_WITH_INCLUDED({include});
  } else {
    responseData = await TrainModel.GET_ALL();
  }
  res.status(responseData.length > 0 ? 200 : 404).json(responseData);
}

export {
  getAll
};