import {ResponseMessage} from "../../types/responseMessage";
import {RowsDataResponse} from "../../types/RowsDataResponse";

const getSuccess = <T = never>(data: T extends never ? RowsDataResponse : T, status = 200): ResponseMessage => {
  return {error: false, status, data}
}

export {getSuccess}
