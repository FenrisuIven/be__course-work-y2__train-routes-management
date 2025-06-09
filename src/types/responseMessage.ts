export type ResponseMessage = {
  error: boolean,
  status?: number,
  data: { rows: any[] } & Record<string, any> | Record<string, any>,
}