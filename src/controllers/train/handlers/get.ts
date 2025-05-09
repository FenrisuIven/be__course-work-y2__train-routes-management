import { Request, Response } from "express";

import TrainModel from "../../../models/train";

const getAll = async (req: Request, res: Response) => {
  const include = [req.query.include as string[]].flat().reduce<Record<string, boolean>>((acc, value) => {
    return {...acc, [value]: true};
  }, {});

  const remap = req.query.remap === "" && Object.keys(include).length > 0;

  let responseData = [];
  const trainModel = new TrainModel();
  if (Object.keys(include).length > 0) {
    responseData = await trainModel.GET_ALL_WITH_INCLUDED({ include, remap });
  } else {
    responseData = await trainModel.GET_ALL();
  }
  res.status(responseData.length > 0 ? 200 : 404).json(responseData);
}

export {
  getAll
};