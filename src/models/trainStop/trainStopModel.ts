import prismaClient from "../../setup/orm/prisma";
import type {TrainStop, Station, Route} from "@prisma/client";
import Model from "../../classes/Model";

type TrainStopWithIncludes = TrainStop & {
  station: Station | null;
  routes: Route[] | null;
}

class TrainStopModel extends Model{
  public async GET_ALL(){
    return prismaClient.trainStop.findMany();
  }
  public GET_ALL_WITH_INCLUDED({ include, remap }: {
    include: {
      station?: boolean,
      routes?: boolean
    },
    remap?: boolean
  }): Promise<any[]> {
    return new Promise(resolve => {});
  }

  public static mapToDestructed(targetObject: TrainStopWithIncludes){ }
}

export {TrainStopModel};