import { createAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { RequestBuilder } from "../../../backend/RequestBuilder";
import {
    BaseAction,
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse, onTagFlipError,
    toJson
} from "../Common";
import { toast } from "react-toastify";


export const FETCH_CORPORA = "FETCH_CORPORA";
export const RECEIVE_CORPORA = "RECEIVE_CORPORA";
export const fetchCorpora = createAction(FETCH_CORPORA)
export const fetchCorporaEpic = action$ => action$.pipe(
    ofType(FETCH_CORPORA),
    mergeMap(action =>
        fromFetch(RequestBuilder.GET("corpus")).pipe(
            toJson(
                map(json => createFetchSuccessAction(RECEIVE_CORPORA)(json)),
                onTagFlipError(createFetchErrorAction(RECEIVE_CORPORA))
            )
        )
    )
)


export const DELETE_CORPUS = "DELETE_CORPUS";
export const RECEIVE_DELETE_CORPUS = "RECEIVE_DELETE_CORPUS";

export const deleteCorpus = createPayloadAction<number>(DELETE_CORPUS)
export const receiveDeleteCorpus = createPayloadAction<number>(RECEIVE_DELETE_CORPUS);
export const deleteCorpusEpic = action$ => action$.pipe(
    ofType(DELETE_CORPUS),
    mergeMap((action: BaseAction) =>
        fromFetch(RequestBuilder.DELETE(`corpus/${action.payload}`)).pipe(
            handleResponse(
                map((res) => {
                    toast.info("Deleted!");
                    return receiveDeleteCorpus(action.payload)
                }),
                onTagFlipError((err) => receiveDeleteCorpus(action.payload))
            )
        )
    )
)
