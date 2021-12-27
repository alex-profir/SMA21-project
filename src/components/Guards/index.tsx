export type CustomFC<T = {}> = (p: {
    children?:
    | ((guardPass: boolean) => React.ReactNode)
    | React.ReactNode;
} & T) => JSX.Element
export const isFunction = (obj: any): obj is Function =>
    typeof obj === 'function';