export type ServerErrorValue = string | {
    [key: string]: string
}
export interface ServerError {
    message: ServerErrorValue
}