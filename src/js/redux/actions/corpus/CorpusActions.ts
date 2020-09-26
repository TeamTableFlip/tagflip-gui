import Corpus from "../../../backend/model/Corpus";
import { ofType } from "redux-observable";
import { filter, map, mergeMap, switchMap } from "rxjs/operators";

import { createAction } from "@reduxjs/toolkit";
import { fromFetch } from "rxjs/fetch";
import { HttpMethod, RequestBuilder } from "../../../backend/RequestBuilder";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    toJson
} from "../Common";
import { toast } from "react-toastify";
import { BaseAction, PayloadAction } from "../types";
import { uploadActiveCorpusDocuments } from "./DocumentActions";
import AnnotationSet from "../../../backend/model/AnnotationSet";


// Actions for editing a corpus

export const SET_ACTIVE_CORPUS = "SET_ACTIVE_CORPUS";

export const setActiveCorpus = createPayloadAction<Corpus>(SET_ACTIVE_CORPUS);
export const setActiveCorpusEpic = action$ => action$.pipe(
    ofType(SET_ACTIVE_CORPUS),
    filter((action: PayloadAction<Corpus>) => (action.payload && action.payload.corpusId > 0)),
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
        fromFetch(RequestBuilder.GET(`corpus/${action.payload}`)).pipe(
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
        fromFetch(RequestBuilder.REQUEST(`corpus`,
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

export const SAVE_CORPUS_AND_UPLOAD_DOCUMENTS = "SAVE_CORPUS_AND_UPLOAD_DOCUMENTS";
export const saveCorpusAndUploadDocuments = createPayloadAction<Corpus & { files: File[] }>(SAVE_CORPUS_AND_UPLOAD_DOCUMENTS);
export const saveCorpusAndUploadDocumentsEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_CORPUS_AND_UPLOAD_DOCUMENTS),
    mergeMap((action: PayloadAction<Corpus & { files: File[] }>) => (
        fromFetch(RequestBuilder.REQUEST(`corpus`,
            action.payload.corpusId && action.payload.corpusId > 0 ?
                HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
                    toJson(mergeMap((res: Corpus) => {
                        toast.success("Corpus saved!");
                        if (action.payload.files && action.payload.files.length > 0) {
                            toast.info("Uploading Documents now...");
                            return [
                                createFetchSuccessAction<Corpus>(RECEIVE_UPDATE_ACTIVE_CORPUS)(res),
                                uploadActiveCorpusDocuments(action.payload.files)
                            ]
                        } else {
                            return [
                                createFetchSuccessAction<Corpus>(RECEIVE_UPDATE_ACTIVE_CORPUS)(res)
                            ]
                        }
                    }),
                        onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_CORPUS))
                    )
                )
    )
    )
)



// Actions for selecting and unselecting AnnotationSets in active corpus.
export const TOGGLE_ACTIVE_CORPUS_ANNOTATION_SET = "TOGGLE_ACTIVE_CORPUS_ANNOTATION_SET";
export const ADD_CORPUS_ANNOTATION_SET = "ADD_CORPUS_ANNOTATION_SET";
export const REMOVE_CORPUS_ANNOTATION_SET = "REMOVE_CORPUS_ANNOTATION_SET";
export const toggleActiveCorpusAnnotationSet = createPayloadAction<AnnotationSet>(TOGGLE_ACTIVE_CORPUS_ANNOTATION_SET)
export const toggleActiveCorpusAnnotationSetEpic = (action$, state$) => action$.pipe(
    ofType(TOGGLE_ACTIVE_CORPUS_ANNOTATION_SET),
    switchMap((action: BaseAction) => {
        const corpusId = state$.value.activeCorpus.values.corpusId;
        const selectedAnnotationSets = state$.value.activeCorpus.annotationSets.items;
        const selectedAnnotationSetIds = new Set(selectedAnnotationSets.map(s => s.annotationSetId));
        let method = HttpMethod.PUT;
        let toggleAction = ADD_CORPUS_ANNOTATION_SET;
        if (selectedAnnotationSetIds.has(action.payload.annotationSetId)) {
            method = HttpMethod.DELETE;
            toggleAction = REMOVE_CORPUS_ANNOTATION_SET;
        }
        return fromFetch(RequestBuilder.REQUEST(`corpus/${corpusId}/annotationset/${action.payload.annotationSetId}`, method)).pipe(
            handleResponse(
                map((res) => {
                    toast.success("Saved!");
                    return createPayloadAction<AnnotationSet>(toggleAction)(action.payload)
                }),
                onTagFlipError(createFetchErrorAction(RECEIVE_ACTIVE_CORPUS_ANNOTATION_SETS))
            )
        )
    })
)

// Actions for getting AnnotationSets while editing a corpus
export const FETCH_ACTIVE_CORPUS_ANNOTATION_SETS = "FETCH_ACTIVE_CORPUS_ANNOTATION_SETS";
export const RECEIVE_ACTIVE_CORPUS_ANNOTATION_SETS = "RECEIVE_ACTIVE_CORPUS_ANNOTATION_SETS";
export const fetchActiveCorpusAnnotationSets = createAction(FETCH_ACTIVE_CORPUS_ANNOTATION_SETS)
export const fetchActiveCorpusAnnotationSetsEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS_ANNOTATION_SETS),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    mergeMap((action: BaseAction) =>
        fromFetch(RequestBuilder.GET(`corpus/${state$.value.activeCorpus.values.corpusId}/annotationset`)).pipe(
            toJson(
                map((res: AnnotationSet[]) => createFetchSuccessAction<AnnotationSet[]>(RECEIVE_ACTIVE_CORPUS_ANNOTATION_SETS)(res)),
                onTagFlipError(createFetchErrorAction(RECEIVE_ACTIVE_CORPUS_ANNOTATION_SETS))
            )
        )
    )
)

