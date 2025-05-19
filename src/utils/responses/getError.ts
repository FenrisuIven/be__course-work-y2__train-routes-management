import {ResponseMessage} from "../../types/responseMessage";

const getError = (data: Record<string, any>, status = 500): ResponseMessage => {
  return {error: true, status, data}
}

export {getError}