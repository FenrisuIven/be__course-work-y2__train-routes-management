import express from 'express';
import cors from "cors";
const app = express();

import prismaClient from "./src/setup/orm/prisma";
import asyncHandler from "./src/utils/asyncHandler";

app.use(cors());

app.get("/", asyncHandler(async (req, res) => {
  const trains = await prismaClient.train.findMany({
    include:{
      tracker: true
    }
  })

  const responseData = trains.map((row) => {
    const {tracker, ...train} = row;
    return {...train, trackerID: tracker.id, trackerSerial: tracker.serial};
  });

  res.status(responseData.length ? 200 : 404).json(responseData);
}))

app.listen(3000, () => console.log("Server is listening on: http:\\\\localhost:3000"));