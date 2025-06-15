import {Request} from "express";

import { repositories } from "../../../repositories";
import {ResponseMessage} from "../../../types/responseMessage";
import getAll, {GetAllPayload} from "../../handlers/getAll";
import {getResponseMessage} from "../../../utils/responses/getResponseMessage";

const routesGetAll = async (params: GetAllPayload): Promise<ResponseMessage> => {
  return getAll({...params, include: {stops: true}}, repositories.RoutesRepository);
}

const routesGetTransfers = async (req: Request): Promise<ResponseMessage> => {
  const startStopID = Number(req.query.start);
  const endStopID = Number(req.query.end);

  if (isNaN(startStopID) || isNaN(endStopID)) {
    console.log({startStopID, endStopID})
    return getResponseMessage({message: 'Invalid start or end stop ID'}, 400);
  }

  return repositories.RoutesRepository.GET_TRANSFER({ startStopID, endStopID });
}

const routesGetAllFree = async (): Promise<ResponseMessage> => {
  return repositories.RoutesRepository.GET_ALL({
    filter: {
      where: { voyage: { none: {} } }
    }
  });
}

export {
  routesGetAll,
  routesGetTransfers,
  routesGetAllFree
};