import prismaClient from "../../setup/orm/prisma";
import {RequestPayload} from "../types/requestPayload";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

export type SearchInTablePayload = Required<Omit<RequestPayload, "include" | "noremap" | "body">>

const searchInTable = async({
  search, skip, take
}: SearchInTablePayload ) => {
  const {value, inTable, inColumn, cmp} = search;

  const baseQuery = (comparison: string) => `SELECT row_to_json(r0) as rowtojson FROM (SELECT * FROM "public"."${inTable}" as t0 WHERE t0."${inColumn}"::text ${comparison}) r0`

  const comparison = cmp === "starts" ? `${value}%` : `%${value}`;
  const condition = cmp ? `LIKE '${comparison}'::text` : `= '${value}'`;
  const limit = take ? `LIMIT ${take}` : '';
  const offset = skip ? `OFFSET ${skip}` : '';

  const query = baseQuery(condition) + ` ${limit} ${offset}`.trim();

  const queryResult: { rowtojson: Record<string, any> }[] = await prismaClient.$queryRawUnsafe(query)
    .then((d)=>d)
    .catch(e=>e);
  const remapped = queryResult.map(row => ({...row.rowtojson}))

  return getResponseMessage({rows: remapped || [], count: remapped.length});
}

export default searchInTable;