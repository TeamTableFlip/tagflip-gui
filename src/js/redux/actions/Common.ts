import { TagFlipError } from "@fhswf/tagflip-common";
import { catchError, map, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { toast } from "react-toastify";
import FetchStatusType from "./FetchStatusTypes";

export const GLOBAL_ERROR = "GLOBAL_ERROR";
export const globalError = (err: any) => {
    toast.error("Global Error: " + err);
    return {
        type: GLOBAL_ERROR,
        payload: err
    }
}

export function onTagFlipError(onError: (err: TagFlipError) => any) {
    return function <T>(source: Observable<Response>) {
        return source.pipe(
            switchMap(error => {
                if (error instanceof Response) {
                    return of(error).pipe(
                        switchMap(err => err.json()),
                        map((err: TagFlipError) => {
                            toast.error(err.message)
                            return onError(err)
                        }),
                    )
                } else {
                    return of(error).pipe(
                        map(err => globalError(err))
                    )
                }
            })
        )
    }
}

export function handleResponse(successOperator: ((source: Observable<Response>) => any), errorOperator: ((source: Observable<Response>) => any) = (err => globalError(err))) {
    return function <T>(source: Observable<Response>) {
        return source.pipe(
            switchMap(response => {
                if (response.ok) {
                    return Promise.resolve(response)
                }
                return Promise.reject(response);
            }),
            successOperator,
            catchError((error: Response, caught) => {
                return of(error).pipe(
                    errorOperator
                )
            })
        );
    }
}

export function toJson<V>(successOperator: (source: Observable<V>) => any, errorOperator: (source: Observable<Response>) => any) {
    return function <T>(source: Observable<Response>) {
        return source.pipe(
            switchMap(response => {
                if (response.ok) {
                    return Promise.resolve(response.json())
                }
                return Promise.reject(response);
            }),
            successOperator,
            catchError((error: Response, caught) => {
                return of(error).pipe(
                    errorOperator
                )
            })
        );
    }
}

export interface BaseAction {
    type: any,
    payload: any
}

export interface PayloadAction<T> extends BaseAction {
    payload: T
}

export interface PayloadStatusAction<T> extends BaseAction {
    payload: {
        data: T,
        receivedAt: number,
        status: FetchStatusType,
        error: any
    }
}

export function createPayloadAction<T>(type: string): ((data: T) => PayloadAction<T>) {
    return (data: T): PayloadAction<T> => ({
        type: type,
        payload: data
    });
}

export function createFetchSuccessAction<T>(type: string): ((data: T) => PayloadStatusAction<T>) {
    return (data: T): PayloadStatusAction<T> => ({
        type: type,
        payload: {
            data,
            receivedAt: Date.now(),
            status: FetchStatusType.success,
            error: null
        }
    });
}

export function createFetchErrorAction<T>(type: string): ((error: any) => PayloadStatusAction<T>) {
    return (error: any): PayloadStatusAction<T> => ({
        type: type,
        payload: {
            data: undefined,
            receivedAt: undefined,
            status: FetchStatusType.error,
            error
        }
    });
}
