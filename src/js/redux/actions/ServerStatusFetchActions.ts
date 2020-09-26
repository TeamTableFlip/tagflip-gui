import FetchStatusType from "./FetchStatusTypes";
import {createAction} from "@reduxjs/toolkit";
import {ofType} from "redux-observable";
import {catchError, filter, map, mergeMap, switchMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {RequestBuilder} from "../../backend/RequestBuilder";
import {handleResponse} from "./Common";
import {TagFlipError} from "@fhswf/tagflip-common";
import {of} from "rxjs";


export const FETCH_SERVER_STATUS = "FETCH_SERVER_STATUS";
export const RECEIVE_SERVER_STATUS = "RECEIVE_SERVER_STATUS";


export const fetchServerStatus = createAction(FETCH_SERVER_STATUS);
export type ServerStatusAction = {
    type: typeof RECEIVE_SERVER_STATUS,
    payload:  {
        available: boolean,
        receivedAt: number,
        status: FetchStatusType,
        error: any
    }
}
export const receiveServerStatusSuccess = () : ServerStatusAction => {
    return {
        type: RECEIVE_SERVER_STATUS,
        payload: {
            available: true,
            receivedAt: Date.now(),
            status: FetchStatusType.success,
            error: null
        }
    }
}
export const receiveServerStatusError = (error: any) : ServerStatusAction => {
    return {
        type: RECEIVE_SERVER_STATUS,
        payload: {
            available: false,
            receivedAt: Date.now(),
            status: FetchStatusType.error,
            error: error
        }
    }
}

export const fetchServerStatusEpic = action$ => action$.pipe(
    ofType(FETCH_SERVER_STATUS),
    mergeMap(action =>
        fromFetch(RequestBuilder.GET("/test")).pipe(
            switchMap(res => {
                if (res.ok)
                    return Promise.resolve(res);
                return Promise.reject(res);
            }),
            map(res => receiveServerStatusSuccess()),
            catchError((err, caught) =>
                of(err).pipe(
                    map(() => receiveServerStatusError(err))
                )
            )
        )
    )
)
