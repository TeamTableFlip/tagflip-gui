import FetchStatusType from "../FetchStatusTypes";
import client from "../../../backend/RestApi";
import {ofType} from "redux-observable";
import {filter, map, mergeMap, switchMap} from "rxjs/operators";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    toJson, toText
} from "../Common";
import {fromFetch} from "rxjs/fetch";
import {OffsetLimitParam, QueryParam, RequestBuilder} from "../../../backend/RequestBuilder";
import {toast} from "react-toastify";
import {fetchTagsForActiveDocument} from "./TaggingActions";
import Document from "../../../backend/model/Document";
import {BaseAction, PayloadAction} from "../types";
import {createAction} from "@reduxjs/toolkit";


export const FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT = "FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT";
export const RECEIVE_ACTIVE_CORPUS_DOCUMENT_COUNT = "RECEIVE_ACTIVE_CORPUS_DOCUMENT_COUNT";
export const fetchActiveCorpusDocumentCount = createAction(FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT);
export const fetchActiveCorpusDocumentCountEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS_DOCUMENT_COUNT),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    mergeMap((action: BaseAction) =>
        fromFetch(RequestBuilder.GET(`/corpus/${state$.value.activeCorpus.values.corpusId}/document`, [{key:"count", value:true}])).pipe(
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
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET(`/corpus/${state$.value.activeCorpus.values.corpusId}/document`, action.payload)).pipe(
            toJson(
                mergeMap((res: Document[]) => [
                    fetchActiveCorpusDocumentCount(),
                    createFetchSuccessAction<Document[]>(RECEIVE_ACTIVE_CORPUS_DOCUMENTS)(res)
                ] ),
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
            return fromFetch(RequestBuilder.POST(`/corpus/${state$.value.activeCorpus.values.corpusId}/document/import`, formData, {})).pipe(
                toJson(
                    mergeMap(res => {
                        toast.success("Uploaded!")
                        return [
                            createFetchSuccessAction(RECEIVE_ACTIVE_CORPUS_UPLOAD_DOCUMENTS)(res),
                            fetchActiveCorpusDocuments(OffsetLimitParam.of(0,10))
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
        fromFetch(RequestBuilder.DELETE(`/corpus/${state$.value.activeCorpus.values.corpusId}/document/${action.payload}`)).pipe(
            handleResponse(
                mergeMap((_) => {
                    toast.info("Deleted!")
                    return [
                        createFetchSuccessAction(RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT)(action.payload),
                        fetchActiveCorpusDocumentCount()
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
type FetchCorpusPayload = {
    documentId: number,
    withTags: boolean
}
export const fetchActiveCorpusDocument = createPayloadAction<FetchCorpusPayload>(FETCH_ACTIVE_CORPUS_DOCUMENT);
export const fetchActiveCorpusDocumentEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS_DOCUMENT),
    filter((action: PayloadAction<FetchCorpusPayload>) => action.payload.documentId > 0),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    switchMap((action: PayloadAction<FetchCorpusPayload>) =>
        fromFetch(RequestBuilder.GET(`/corpus/${state$.value.activeCorpus.values.corpusId}/document/${action.payload.documentId}`)).pipe(
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

//// ==============================

//// SEE IMPORT BELOW


export const REQUEST_CORPUS_IMPORT = "REQUEST_CORPUS_IMPORT";
export const RECEIVE_CORPUS_IMPORT = "RECEIVE_CORPUS_IMPORT";

function requestCorpusUpload() {
    return {
        type: REQUEST_CORPUS_IMPORT,
    }
}

function receiveCorpusUpload(result, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_IMPORT,
        corpus: result.corpus,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Action creator for async uploading given files to given corpus.
 * @param corpusId the id of the corpus the file belong to
 * @param files the files
 * @returns {Function}
 */
export function uploadCorpus(files) {
    return (dispatch, getState) => {
        dispatch(requestCorpusUpload())
        let corpus = getState().activeCorpus.values;
        let annotationSets = getState().activeCorpus.annotationSets.items;
        let formData = new FormData()
        for (let file of files) {
            formData.append("file", file, file.name);
            formData.append("name", corpus.name)
            // TODO: allow multiple annotation sets
            formData.append("annotationSet", annotationSets[0].name)
        }

        client.httpPost(`/import`, formData, {}, false)
            .then(result => {
                    dispatch(receiveCorpusUpload(result))
                }
            )
            .catch(error => dispatch(receiveCorpusUpload(null, FetchStatusType.error, error)))
    }
}
