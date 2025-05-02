import {Request, Response} from "express";
import prismaClient from "../../setup/orm/prisma";

import type {Train, Tracker} from "@prisma/client";

const getAll = async (req: Request, res: Response) => {
  const trains: (
    Train &
    { tracker: Tracker}
    )[] = await prismaClient.train.findMany({
    include:{
      tracker: true
    }
  })

  const responseData: TrainWithTracker[] = trains.map((
    row: Train & { tracker: Tracker }
  ): TrainWithTracker => {
    const {tracker, ...train} = row;
    return {...train, trackerID: tracker.id, trackerSerial: tracker.serial};
  });

  res.status(responseData.length > 0 ? 200 : 404).json(responseData);
}

export default {
  getAll
};