import { ofType } from "redux-observable";
import { filter, map, mergeMap, switchMap } from "rxjs/operators";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    toJson, toText
} from "../Common";
import { fromFetch } from "rxjs/fetch";
import { OffsetLimitParam, QueryParam, RequestBuilder, SimpleQueryParam } from "../../../backend/RequestBuilder";
import { toast } from "react-toastify";
import Document from "../../../backend/model/Document";
import { BaseAction, PayloadAction } from "../types";
import { createAction } from "@reduxjs/toolkit";
import Tag from "../../../backend/model/Tag";


export const FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT = "FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT";
export const RECEIVE_ACTIVE_CORPUS_DOCUMENT_COUNT = "RECEIVE_ACTIVE_CORPUS_DOCUMENT_COUNT";
export const fetchActiveCorpusDocumentCount = createPayloadAction<QueryParam[]>(FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT);
export const fetchActiveCorpusDocumentCountEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET(`corpus/${state$.value.activeCorpus.values.corpusId}/document`, [SimpleQueryParam.of("count", true), ... (action.payload || [])])).pipe(
            handleResponse(
                toText(
                    map((res: string) => createFetchSuccessAction<number>(RECEIVE_ACTIVE_CORPUS_DOCUMENT_COUNT)(Number.parseInt(res)))
                )
            )
        )
    )
)


// Actions for getting Documents while editing a corpus
export const FETCH_ACTIVE_CORPUS_DOCUMENTS = "FETCH_ACTIVE_CORPUS_DOCUMENTS";
export const RECEIVE_ACTIVE_CORPUS_DOCUMENTS = "RECEIVE_ACTIVE_CORPUS_DOCUMENTS";
export const fetchActiveCorpusDocuments = createPayloadAction<QueryParam[]>(FETCH_ACTIVE_CORPUS_DOCUMENTS);
export const fetchActiveCorpusDocumentsEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS_DOCUMENTS),
    filter(() => state$.value.activeCorpus.values && state$.value.activeCorpus.values.corpusId > 0),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET(`corpus/${state$.value.activeCorpus.values.corpusId}/document`, action.payload)).pipe(
            toJson(
                mergeMap((res: Document[]) => [
                    fetchActiveCorpusDocumentCount(action.payload),
                    createFetchSuccessAction<Document[]>(RECEIVE_ACTIVE_CORPUS_DOCUMENTS)(res)
                ]),
                createFetchErrorAction(RECEIVE_ACTIVE_CORPUS_DOCUMENTS)
            )
        )
    )
)

// Actions for uploading Documents while editing a corpus

export const UPLOAD_ACTIVE_CORPUS_DOCUMENTS = "UPLOAD_ACTIVE_CORPUS_DOCUMENTS";
export const RECEIVE_ACTIVE_CORPUS_UPLOAD_DOCUMENTS = "RECEIVE_ACTIVE_CORPUS_UPLOAD_DOCUMENTS";
export const uploadActiveCorpusDocuments = createPayloadAction<File[]>(UPLOAD_ACTIVE_CORPUS_DOCUMENTS)
export const uploadActiveCorpusDocumentsEpic = (action$, state$) => action$.pipe(
    ofType(UPLOAD_ACTIVE_CORPUS_DOCUMENTS),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    map((action: PayloadAction<File[]>) => {
        let formData = new FormData()
        for (let file of action.payload) {
            formData.append("files", file, file.name)
        }
        return formData
    }),
    mergeMap((formData: FormData) => {
        return fromFetch(RequestBuilder.POST(`corpus/${state$.value.activeCorpus.values.corpusId}/document/import`, formData, {})).pipe(
            toJson(
                mergeMap(res => {
                    toast.success("Uploaded!")
                    return [
                        createFetchSuccessAction(RECEIVE_ACTIVE_CORPUS_UPLOAD_DOCUMENTS)(res),
                        fetchActiveCorpusDocuments(OffsetLimitParam.of(0, 10))
                    ]
                }),
                onTagFlipError(createFetchErrorAction(RECEIVE_ACTIVE_CORPUS_UPLOAD_DOCUMENTS))
            )
        )
    }
    )
)


// Actions for deleting documents
/**
 * Action creator for async delete of given document.
 * @param documentId the id of the document
 * @returns {Function}
 */
export const DELETE_ACTIVE_CORPUS_DOCUMENT = "DELETE_ACTIVE_CORPUS_DOCUMENT";
export const RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT = "RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT";
export const deleteActiveCorpusDocument = createPayloadAction<number>(DELETE_ACTIVE_CORPUS_DOCUMENT)
export const deleteActiveCorpusDocumentEpic = (action$, state$) => action$.pipe(
    ofType(DELETE_ACTIVE_CORPUS_DOCUMENT),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    mergeMap((action: BaseAction) =>
        fromFetch(RequestBuilder.DELETE(`corpus/${state$.value.activeCorpus.values.corpusId}/document/${action.payload}`)).pipe(
            handleResponse(
                mergeMap((_) => {
                    toast.info("Deleted!")
                    return [
                        fetchActiveCorpusDocumentCount([]),
                        createFetchSuccessAction(RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT)(action.payload)
                    ]
                }),
                onTagFlipError(() => createFetchErrorAction(RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT)(action.payload))
            )
        )
    )
)


// Actions for displaying document contents
export const FETCH_ACTIVE_CORPUS_DOCUMENT = "FETCH_ACTIVE_CORPUS_DOCUMENT";
export const RECEIVE_ACTIVE_CORPUS_DOCUMENT = "RECEIVE_ACTIVE_CORPUS_DOCUMENT";
export type FetchCorpusPayload = {
    documentId: number,
    withTags: boolean
}
export const fetchActiveCorpusDocument = createPayloadAction<FetchCorpusPayload>(FETCH_ACTIVE_CORPUS_DOCUMENT);
export const fetchActiveCorpusDocumentEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS_DOCUMENT),
    filter((action: PayloadAction<FetchCorpusPayload>) => action.payload.documentId > 0),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    switchMap((action: PayloadAction<FetchCorpusPayload>) =>
        fromFetch(RequestBuilder.GET(`corpus/${state$.value.activeCorpus.values.corpusId}/document/${action.payload.documentId}`)).pipe(
            toJson(
                mergeMap((res: Document) => {
                    if (!action.payload.withTags)
                        return [createFetchSuccessAction<Document>(RECEIVE_ACTIVE_CORPUS_DOCUMENT)(res)]
                    return [
                        createFetchSuccessAction<Document>(RECEIVE_ACTIVE_CORPUS_DOCUMENT)(res),
                        fetchTagsForActiveDocument()
                    ]
                }),
                createFetchErrorAction(RECEIVE_ACTIVE_CORPUS_DOCUMENT)
            )
        )
    )
)




export const FETCH_TAGS_FOR_ACTIVE_DOCUMENT = "FETCH_TAGS_FOR_ACTIVE_DOCUMENT"
export const RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT = "RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT";
export const fetchTagsForActiveDocument = createAction(FETCH_TAGS_FOR_ACTIVE_DOCUMENT);
export const fetchTagsForActiveDocumentEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_TAGS_FOR_ACTIVE_DOCUMENT),
    mergeMap((action: PayloadAction<Tag>) => {
        let documentId = state$.value.activeCorpus.activeDocument.item.documentId
        return fromFetch(RequestBuilder.GET(`/document/${documentId}/tag`)).pipe(
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