import {RequestHandler} from "express";
import {ResponseMessage} from "../../types/responseMessage";
import {RequestPayload} from "../../controllers/types/requestPayload";

type RequestQueryPayloadRaw = {
  include?: string | string[],
  skip?: string,
  take?: string,
  noremap?: string,
};

const handleRequestWithParameters = <T extends RequestPayload>(callback: (
  params: T
) => Promise<ResponseMessage>): RequestHandler<{}, {}, any, RequestQueryPayloadRaw> => {
  return async (req, res): Promise<any> => {
    let include;
    if (req.query.include) {
      const includeArray = Array.isArray(req.query.include) ? req.query.include : [req.query.include];
      include = includeArray.reduce<Record<string, boolean>>((acc, value) => {
        return {...acc, [value]: true};
      }, {});
    }

    const noremap = req.query.noremap === "";
    const responseData = await callback({include, skip: 0, take: 0, noremap, body: req.body} as T);

    res.status(responseData.status || 200).json(responseData);
  }
}

export {handleRequestWithParameters}