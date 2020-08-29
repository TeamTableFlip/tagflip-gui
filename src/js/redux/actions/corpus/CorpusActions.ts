import Corpus from "../../../backend/model/Corpus";
import {ofType} from "redux-observable";
import {filter, map, mergeMap} from "rxjs/operators";

import {createAction} from "@reduxjs/toolkit";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, RequestBuilder} from "../../../backend/RequestBuilder";
import {createFetchErrorAction, createFetchSuccessAction, createPayloadAction, onTagFlipError, toJson} from "../Common";
import {toast} from "react-toastify";
import {BaseAction, PayloadAction} from "../types";


// Actions for editing a corpus

export const SET_ACTIVE_CORPUS = "SET_ACTIVE_CORPUS";

export const setActiveCorpus = createPayloadAction<Corpus>(SET_ACTIVE_CORPUS);
export const setActiveCorpusEpic = action$ => action$.pipe(
    ofType(SET_ACTIVE_CORPUS),
    filter((action: PayloadAction<Corpus>) => (action.payload.corpusId > 0)),
    map((action: PayloadAction<Corpus>) => fetchActiveCorpus(action.payload.corpusId))
)

// Actions for saving edited corpus
export const RECEIVE_UPDATE_ACTIVE_CORPUS = "RECEIVE_UPDATE_ACTIVE_CORPUS";
export const FETCH_ACTIVE_CORPUS = "FETCH_ACTIVE_CORPUS";
export const fetchActiveCorpus = createPayloadAction<number>(FETCH_ACTIVE_CORPUS)
export const fetchActiveCorpusEpic = action$ => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS),
    filter((action: BaseAction) => action.payload && action.payload > 0),
    mergeMap((action: BaseAction) =>
        fromFetch(RequestBuilder.GET(`/corpus/${action.payload}`)).pipe(
            toJson(
                mergeMap((res: Corpus) => (
                    [createFetchSuccessAction<Corpus>(RECEIVE_UPDATE_ACTIVE_CORPUS)(res)]
                )),
                onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_CORPUS))
            )
        )
    ),
)

export const SAVE_CORPUS = "SAVE_CORPUS";
export const saveCorpus = createPayloadAction<Corpus>(SAVE_CORPUS);
export const saveCorpusEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_CORPUS),
    mergeMap((action: PayloadAction<Corpus>) => (
            fromFetch(RequestBuilder.REQUEST(`/corpus`,
                action.payload.corpusId && action.payload.corpusId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
                toJson(mergeMap((res: Corpus) => {
                        toast.success("Saved!");
                        return [createFetchSuccessAction<Corpus>(RECEIVE_UPDATE_ACTIVE_CORPUS)(res)]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_CORPUS))
                )
            )
        )
    )
)

