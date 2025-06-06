import type { Station } from "@prisma/client";

export type NewStationRequiredFields = Required<Omit<Station, "id">>;