import type { Schedule } from "@prisma/client";

export type NewScheduleRequiredFields = Required<Omit<Schedule, "id">>