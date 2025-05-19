import {ResponseMessage} from "../types/responseMessage";

abstract class Repository {
  abstract GET_ALL(): Promise<ResponseMessage>;
  abstract GET_ALL_WITH_INCLUDED(params: {
    include?: Record<string, boolean>;
    skip?: number;
    take?: number;
    noremap?: boolean;
  }): Promise<ResponseMessage>;
  abstract POST_CREATE_ONE(data: Record<any, any>): Promise<ResponseMessage>;
}

export default Repository;