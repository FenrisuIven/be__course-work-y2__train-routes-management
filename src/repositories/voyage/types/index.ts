import type { Voyage } from "@prisma/client";

export type NewVoyageRequiredFields = Required<Omit<Voyage, "id">>