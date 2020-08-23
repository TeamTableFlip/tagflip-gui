import FetchStatusType from "../FetchStatusTypes";
/** TODO: Replace with RequestBuilder */
import client from "../../../backend/RestApi";
import { ofType } from "redux-observable";
import { filter, map, mergeMap, switchMap } from "rxjs/operators";
import {
    BaseAction,
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    PayloadAction,
    toJson
} from "../Common";
import { fromFetch } from "rxjs/fetch";
import { RequestBuilder } from "../../../backend/RequestBuilder";
import { toast } from "react-toastify";
import { createAction } from "@reduxjs/toolkit";
import { fetchTagsForActiveDocument } from "./TaggingActions";
import Document from "../../../backend/model/Document";


// Actions for getting Documents while editing a corpus
export const FETCH_ACTIVE_CORPUS_DOCUMENTS = "FETCH_ACTIVE_CORPUS_DOCUMENTS";
export const RECEIVE_ACTIVE_CORPUS_DOCUMENTS = "RECEIVE_ACTIVE_CORPUS_DOCUMENTS";
export const fetchActiveCorpusDocuments = createAction(FETCH_ACTIVE_CORPUS_DOCUMENTS);
export const fetchActiveCorpusDocumentsEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_CORPUS_DOCUMENTS),
    filter(() => state$.value.activeCorpus.values.corpusId > 0),
    mergeMap((action: BaseAction) =>
        fromFetch(RequestBuilder.GET(`corpus/${state$.value.activeCorpus.values.corpusId}/document`)).pipe(
            toJson(
                map((res: Document[]) => createFetchSuccessAction<Document[]>(RECEIVE_ACTIVE_CORPUS_DOCUMENTS)(res)),
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
                map(res => {
                    toast.success("Uploaded!")
                    return createFetchSuccessAction(RECEIVE_ACTIVE_CORPUS_UPLOAD_DOCUMENTS)(res)
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
                map((_) => {
                    toast.info("Deleted!")
                    return createFetchSuccessAction(RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT)(action.payload)
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
