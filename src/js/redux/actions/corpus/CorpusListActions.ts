import { createAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { filter, map, mergeMap } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { QueryParam, RequestBuilder, SimpleQueryParam } from "../../../backend/RequestBuilder";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse, onTagFlipError,
    toJson, toText
} from "../Common";
import { toast } from "react-toastify";
import { PayloadAction } from "../types";
import Corpus from "../../../backend/model/Corpus";

export const FETCH_CORPORA_COUNT = "FETCH_CORPORA_COUNT";
export const RECEIVE_CORPORA_COUNT = "RECEIVE_CORPORA_COUNT";
export const fetchCorporaCount = createPayloadAction<QueryParam[]>(FETCH_CORPORA_COUNT);
export const fetchCorporaCountEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_CORPORA_COUNT),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET(`corpus`, [SimpleQueryParam.of("count", true), ... (action.payload || [])])).pipe(
            handleResponse(
                toText(
                    map((res: string) => createFetchSuccessAction<number>(RECEIVE_CORPORA_COUNT)(Number.parseInt(res)))
                )
            )
        )
    )
)

export const FETCH_CORPORA = "FETCH_CORPORA";
export const RECEIVE_CORPORA = "RECEIVE_CORPORA";
export const fetchCorpora = createPayloadAction<QueryParam[]>(FETCH_CORPORA)
export const fetchCorporaEpic = action$ => action$.pipe(
    ofType(FETCH_CORPORA),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET("corpus", action.payload)).pipe(
            toJson(
                mergeMap((res: Corpus[]) => [
                    fetchCorporaCount(action.payload),
                    createFetchSuccessAction(RECEIVE_CORPORA)(res)
                ]),
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
    mergeMap((action: PayloadAction<number>) =>
        fromFetch(RequestBuilder.DELETE(`corpus/${action.payload}`)).pipe(
            handleResponse(
                mergeMap((res) => {
                    toast.info("Deleted!");
                    return [
                        fetchCorporaCount([]),
                        receiveDeleteCorpus(action.payload)
                    ]
                }),
                onTagFlipError((err) => receiveDeleteCorpus(action.payload))
            )
        )
    )
)
