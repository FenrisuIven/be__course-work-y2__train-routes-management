import express, {json} from 'express';
import cors from "cors";
const app = express();

import router from "./src/controllers/router";
import {repositories} from "./src/repositories";

app.use(cors());
app.use(json());
app.use(router)

app.listen(3000, () => console.log("Server is listening on: http:\\\\localhost:3000"));

//repositories.TrainStopRepository.GET_ALL({}).then(d=>console.log(d.data.rows));

// repositories.RoutesRepository.POST_CREATE_ONE({name: 'Rote-dfg7', stopIDs: [3, 4], voyageID: 1}).catch(e=>console.error(e));

/*
repositories.RoutesRepository.GET_ALL_WITH_INCLUDED({
  skip: 0,
  take: 5,
  include: { stops: true }
}).then(d=>console.log(
  d.data.rows.map(row => ({
    id: row.id,
    stops: row.stops.map(stop => stop.id)
  }))
));*/

repositories.RoutesRepository.GET_TRANSFER({startStopID: 2, endStopID: 4})