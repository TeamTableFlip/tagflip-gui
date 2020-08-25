import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    toJson
} from "../Common";
import Tag from "../../../backend/model/Tag";
import {ofType} from "redux-observable";
import {map, mergeMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, RequestBuilder} from "../../../backend/RequestBuilder";
import {createAction} from "@reduxjs/toolkit";
import {PayloadAction} from "../types";


// Actions for setting the current Document

export const FETCH_TAGS_FOR_ACTIVE_DOCUMENT = "FETCH_TAGS_FOR_ACTIVE_DOCUMENT"
export const RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT = "RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT";
export const fetchTagsForActiveDocument = createAction(FETCH_TAGS_FOR_ACTIVE_DOCUMENT);
export const fetchTagsForActiveDocumentEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_TAGS_FOR_ACTIVE_DOCUMENT),
    mergeMap((action: PayloadAction<Tag>) => {
            let corpusId = state$.value.activeCorpus.values.corpusId
            let documentId = state$.value.activeCorpus.activeDocument.item.documentId
            return fromFetch(RequestBuilder.GET(`/corpus/${corpusId}/document/${documentId}/tag`)).pipe(
                toJson(
                    map((res: Tag[]) => {
                        return createFetchSuccessAction<Tag[]>(RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT)(res)
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT))
                )
            )
        }
    )
)

export const SAVE_TAG_FOR_ACTIVE_DOCUMENT = "SAVE_TAG_FOR_ACTIVE_DOCUMENT"
export const RECEIVE_SAVE_TAG_FOR_ACTIVE_DOCUMENT = "RECEIVE_SAVE_TAG_FOR_ACTIVE_DOCUMENT";
export const saveTagForActiveDocument = createPayloadAction<Tag>(SAVE_TAG_FOR_ACTIVE_DOCUMENT);
export const saveTagForActiveDocumentEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_TAG_FOR_ACTIVE_DOCUMENT),
    mergeMap((action: PayloadAction<Tag>) => {
            let corpusId = state$.value.activeCorpus.values.corpusId
            let documentId = state$.value.activeCorpus.activeDocument.item.documentId
            return fromFetch(RequestBuilder.REQUEST(`/corpus/${corpusId}/document/${documentId}/tag`,
                action.payload.tagId && action.payload.tagId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
                toJson(map((res: Tag) => createFetchSuccessAction(RECEIVE_SAVE_TAG_FOR_ACTIVE_DOCUMENT)(res)),
                    onTagFlipError(createFetchErrorAction(RECEIVE_SAVE_TAG_FOR_ACTIVE_DOCUMENT))
                )
            )
        }
    )
)


export const DELETE_TAG_FOR_ACTIVE_DOCUMENT = "DELETE_TAG_FOR_ACTIVE_DOCUMENT"
export const RECEIVE_DELETE_TAG_FOR_ACTIVE_DOCUMENT = "RECEIVE_DELETE_TAG_FOR_ACTIVE_DOCUMENT"
export const deleteTagForActiveDocument = createPayloadAction<Tag>(DELETE_TAG_FOR_ACTIVE_DOCUMENT);
export const deleteTagForActiveDocumentEpic = (action$, state$) => action$.pipe(
    ofType(DELETE_TAG_FOR_ACTIVE_DOCUMENT),
    mergeMap((action: PayloadAction<Tag>) => {
            let corpusId = state$.value.activeCorpus.values.corpusId
            let documentId = state$.value.activeCorpus.activeDocument.item.documentId
            return fromFetch(RequestBuilder.DELETE(`/corpus/${corpusId}/document/${documentId}/tag/${action.payload.tagId}`)).pipe(
                handleResponse(
                    map((_) => createFetchSuccessAction(RECEIVE_DELETE_TAG_FOR_ACTIVE_DOCUMENT)(action.payload)),
                    onTagFlipError((err) => createFetchErrorAction(RECEIVE_DELETE_TAG_FOR_ACTIVE_DOCUMENT)(err))
                )
            )
        }
    )
)
