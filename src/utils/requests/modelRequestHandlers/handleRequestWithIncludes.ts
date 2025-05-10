import { Request, Response } from "express";

const handleRequestWithIncludes = async (
  req: Request,
  res: Response,
  callback: (include: Record<string, boolean>, remap: boolean) => Promise<any[]>
) => {
  let include = {};
  if (req.query.include) {
    include = [req.query.include as string[]].flat().reduce<Record<string, boolean>>((acc, value) => {
      return {...acc, [value]: true};
    }, {});
  }

  const remap = req.query.remap === "" && Object.keys(include).length > 0;
  const responseData = await callback(include, remap);

  res.status(responseData.length > 0 ? 200 : 404).json(responseData);
}

export { handleRequestWithIncludes };