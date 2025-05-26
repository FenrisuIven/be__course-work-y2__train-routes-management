import {RequestHandler} from "express";
import {ResponseMessage} from "../../types/responseMessage";
import {RequestPayload} from "../../controllers/types/requestPayload";

type RequestQueryPayloadRaw = {
  include?: string | string[],
  skip?: string,
  take?: string,
  noremap?: string,
  value?:string,
  inTable?:string,
  inColumn?:string,
  cmp?:string,
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
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const take = req.query.take ? Number(req.query.take) : 0;
    const search = {
      value: req.query.value || null,
      inTable: req.query.inTable || null,
      inColumn: req.query.inColumn || null,
      cmp: req.query.cmp || null,
    };

    const responseData = await callback({
      include,
      skip: !isNaN(skip) ? skip : 0,
      take: !isNaN(take) ? take : 0,
      search,
      noremap,
      body: req.body
    } as T);


    res.status(responseData.status || 200).json(responseData);
  }
}

export {handleRequestWithParameters}