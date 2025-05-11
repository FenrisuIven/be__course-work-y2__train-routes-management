import {RequestHandler} from "express";

const handleRequestWithIncludes = (
  callback: (include: Record<string, boolean>, noremap: boolean) => Promise<any[]>
): RequestHandler => {
  return async (req, res) => {
    let include = {};
    if (req.query.include) {
      include = [req.query.include as string[]].flat().reduce<Record<string, boolean>>((acc, value) => {
        return {...acc, [value]: true};
      }, {});
    }

    const noremap = req.query.noremap === "";
    const responseData = await callback(include, noremap);

    res.status(responseData.length > 0 ? 200 : 204).json(responseData);
  }
}

export { handleRequestWithIncludes };