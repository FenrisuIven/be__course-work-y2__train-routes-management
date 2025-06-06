import {ResponseMessage} from "../../types/responseMessage";

const getResponseMessage = (data: Record<string, any>, status = 200): ResponseMessage => {
  return {
    error: status >= 400,
    status,
    data
  }
}

export {getResponseMessage}