export type RequestPayload<TBody extends Record<string, any> = {}> = {
  include?: Record<string, boolean>,
  skip?: number,
  take?: number,
  noremap?: boolean
  body?: TBody
}