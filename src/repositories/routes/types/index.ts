import type {Route} from "@prisma/client";

export type NewRoutesRequiredFields = Required<Omit<Route, 'id'>>
