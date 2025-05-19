import {ResponseMessage} from "../../types/responseMessage";

const getSuccess = (data: Record<string, any>, status = 200): ResponseMessage => {
  return {error: false, status, data}
}

export {getSuccess}