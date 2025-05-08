import { Request, Response } from "express";

import TrainModel from "../../../models/train";

const getAll = async (req: Request, res: Response) => {
  const include = (req.query.include as string[]).reduce<Record<string, boolean>>((acc, value) => {
    return {...acc, [value]: true};
  }, {});

  const remap = req.query.remap === "" && !Object.keys(include).length;

  let responseData = [];
  if (!Object.keys(include).length) {
    responseData = await TrainModel.GET_ALL_WITH_INCLUDED({ include, remap });
  } else {
    responseData = await TrainModel.GET_ALL();
  }
  res.status(responseData.length > 0 ? 200 : 404).json(responseData);
}

export {
  getAll
};