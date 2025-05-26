import {Prisma} from '@prisma/client';

export type RequestPayload<TBody extends Record<string, any> = {}> = {
  include?: Record<string, boolean>;
  search?: {
    value: string;
    inTable: Prisma.ModelName;
    inColumn: string;
    cmp: 'starts' | 'ends' | null;
  };
  skip?: number;
  take?: number;
  noremap?: boolean;
  body?: TBody;
}
