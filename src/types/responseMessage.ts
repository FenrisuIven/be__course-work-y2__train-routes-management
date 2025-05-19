export type ResponseMessage = {
  error: boolean,
  status?: number,
  data: Record<string, any>,
}