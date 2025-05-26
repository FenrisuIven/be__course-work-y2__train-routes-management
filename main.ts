import express, {json} from 'express';
import cors from "cors";
const app = express();

import router from "./src/controllers/router";
import {RequestPayload} from "./src/controllers/types/requestPayload";
import prismaClient from "./src/setup/orm/prisma";

app.use(cors());
app.use(json());
app.use(router)

app.listen(3000, () => console.log("Server is listening on: http:\\\\localhost:3000"));

const params:Required<Pick<RequestPayload, "search">> = {
  search: {
    value: "test",
    inTable: "Train",
    inColumn: "name"
  }
}

const mapToQuery = ({ table, col, where, jsonObj = false }:{
  table: string,
  col: string,
  where?: {
    val: string;
    cmp?: "startsWith" | "endsWith"
  },
  jsonObj?: boolean }
) => {
  const t = [...table.toLowerCase()][0];
  const json = jsonObj ? (subQuery:string) => `SELECT row_to_json(r0) FROM(${subQuery}) r0` : null;
  const baseQuery = `SELECT * FROM "public"."${table}"`;

  let comparison;
  if (where) {
    switch (where.cmp){
      case "startsWith":
        comparison = `${val}%`;
        break;
      case "endsWith":
        comparison = `%${val}`;
        break;
    }
  }
  const finalQuery = baseQuery + (where ? ` as ${t} WHERE ${t}."${col}" ${where.cmp ? `LIKE` : `=`}${where.cmp ? ` '${comparison}'` : ` '${val}'`}` : '');

  return json ? json(finalQuery) : finalQuery;
}

const table = params.search.inTable;
const t = [...params.search.inTable.toLowerCase()][0];
const col = params.search.inColumn
const val = params.search.value

const searchQuery = `SELECT * FROM "public"."${table}" as ${t} WHERE ${t}."${col}" = '${val}'`;
const remapped = ((includes: string[]) => {
  const queries = includes.map((include) => mapToQuery({table: include, col, where: {val}, jsonObj: true }));
  return queries;
})(["Voyage", "Tracker"]);

console.log({remapped})

console.log(mapToQuery({table: "Voyage", col, where: {val, cmp: "endsWith"}, jsonObj: true }));
console.log(mapToQuery({table: "Tracker", col, where: {val}, jsonObj: true }));
console.log(mapToQuery({table: "Tracker", col, jsonObj: true }));
console.log(mapToQuery({table: "Voyage", col }));

prismaClient.$queryRawUnsafe(remapped[0]).then((result) => console.log({result}));

