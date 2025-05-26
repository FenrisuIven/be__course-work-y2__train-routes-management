import prismaClient from "../../setup/orm/prisma";
import {getSuccess} from "../../utils/responses/getSuccess";
import {RequestPayload} from "../types/requestPayload";

export type SearchInTablePayload = Required<Omit<RequestPayload, "include" | "noremap" | "body">>

const searchInTable = async({
  search, skip, take
}: SearchInTablePayload ) => {
  const {value, inTable, inColumn, cmp} = search;
  console.log({search})

  const baseQuery = (comparison: string) => `SELECT row_to_json(r0) FROM (SELECT * FROM "public"."${inTable}" as t0 WHERE t0."${inColumn}"::text ${comparison}) r0`

  const comparison = cmp === "starts" ? `${value}%` : `%${value}`;
  const condition = cmp ? `LIKE '${comparison}'::text` : `= '${value}'`;
  const limit = take ? `LIMIT ${take}` : '';
  const offset = skip ? `OFFSET ${skip}` : '';

  const query = baseQuery(condition) + ` ${limit} ${offset}`.trim();

  console.log({final: query})
  const queryResult = await prismaClient.$queryRawUnsafe(query).then(d=>d).catch(e=>e);
  console.log({queryResult});

  return getSuccess(queryResult || []);
}

export default searchInTable;