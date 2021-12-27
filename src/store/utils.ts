import { Action, ReducersMapObject } from "redux";
import { ThunkDispatch } from "redux-thunk";

export const a = <A extends Action<T>, T extends string>(a: A) => a

export function init<T>(val: T) {
    return val;
}
export function createDispatcher<T extends ReducersMapObject<any, any>>(p: (fn: DispatchOf<T>) => void) {
    return p;
}


export type ParameterFromMap<T extends ReducersMapObject<any, any>, I extends 0 | 1> = {
    [P in keyof T]: Exclude<Parameters<T[P]>[I], undefined>
}

export type StateFromMap<T extends ReducersMapObject<any, any>> = ParameterFromMap<T, 0>
export type ActionsFromMap<T extends ReducersMapObject<any, any>> = ParameterFromMap<T, 1>[keyof T]

export type ActionsOf<T extends ReducersMapObject<any, any>> = {
    [P in keyof T]: T[P] extends ((...a: any) => infer A) ? A extends Action<any> ? A : never : never
}[keyof T]

export type DispatchOf<T extends ReducersMapObject<any, any>> = ThunkDispatch<any, void, ActionsOf<T>>