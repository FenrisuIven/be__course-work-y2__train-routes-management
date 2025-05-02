import express from 'express';
import cors from "cors";
const app = express();

import prismaClient from "./src/setup/orm/prisma";

app.use(cors());

app.get("/", (req, res) => {
  prismaClient.train.findMany({
    include:{
      tracker: true
    }
  }).then((result) => {
    let responseData: {}[] = [];
    if (result) {
      if (result.length > 0) {
        responseData = result.map((row) => {
          const {tracker, ...train} = row;
          return {...train, trackerID: tracker.id, trackerSerial: tracker.serial};
        });
      }
      res.status(200).json(responseData);
      return;
    }
    res.status(404).json(responseData);
  });
})

app.listen(3000, () => console.log("Server is listening on: http:\\\\localhost:3000"));