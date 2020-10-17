import Corpus from "../../../backend/model/Corpus";
import {ofType} from "redux-observable";
import {filter, map, mergeMap, switchMap} from "rxjs/operators";

import {createAction} from "@reduxjs/toolkit";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, OffsetLimitParam, RequestBuilder, SimpleQueryParam} from "../../../backend/RequestBuilder";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction, globalError,
    handleResponse,
    onTagFlipError,
    toJson
} from "../Common";
import {toast} from "react-toastify";
import {BaseAction, PayloadAction} from "../types";
import {
    FETCH_ACTIVE_CORPUS_DOCUMENT,
    fetchActiveCorpusDocuments,
    FetchCorpusPayload,
    uploadActiveCorpusDocuments
} from "./DocumentActions";
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


export const FETCH_IMPORT_TYPES = "FETCH_IMPORT_TYPES";
export const RECEIVE_IMPORT_TYPES = "RECEIVE_IMPORT_TYPES";

export const fetchImportTypes = createAction(FETCH_IMPORT_TYPES);
export const fetchImportTypesEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_IMPORT_TYPES),
    switchMap((action: BaseAction) =>
        fromFetch(RequestBuilder.GET(`corpus/import`)).pipe(
            toJson(
                map((types: string[]) => {
                    return createFetchSuccessAction<string[]>(RECEIVE_IMPORT_TYPES)(types)
                }),
                createFetchErrorAction(RECEIVE_IMPORT_TYPES)
            )
        )
    )
)

export const FETCH_EXPORT_TYPES = "FETCH_EXPORT_TYPES";
export const RECEIVE_EXPORT_TYPES = "RECEIVE_EXPORT_TYPES";
export const fetchExportTypes = createAction(FETCH_EXPORT_TYPES);
export const fetchExportTypesEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_EXPORT_TYPES),
    switchMap((action: BaseAction) =>
        fromFetch(RequestBuilder.GET(`corpus/export`)).pipe(
            toJson(
                map((types: string[]) => {
                    return createFetchSuccessAction<string[]>(RECEIVE_EXPORT_TYPES)(types)
                }),
                createFetchErrorAction(RECEIVE_EXPORT_TYPES)
            )
        )
    )
)

export const EXPORT_CORPUS = "EXPORT_CORPUS";
export const RECEIVE_EXPORT_CORPUS = "RECEIVE_EXPORT_TYPES";
export type ExportCorpusRequest = {
    corpusId: number;
    exporter: string;
};
export const exportAnnotatedCorpus = createPayloadAction<ExportCorpusRequest>(EXPORT_CORPUS);
export const exportAnnotatedCorpusEpic = (action$, state$) => action$.pipe(
    ofType(EXPORT_CORPUS),
    switchMap((action: PayloadAction<ExportCorpusRequest>) =>
        fromFetch(RequestBuilder.GET(`corpus/${action.payload.corpusId}/export`, [SimpleQueryParam.of("exporterName", action.payload.exporter)], {})).pipe(
            handleResponse(
                map((response) => {
                    response.blob().then(blob => {
                            const filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                            let url = window.URL.createObjectURL(blob);
                            let a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again
                        }
                    )
                    return createFetchSuccessAction(RECEIVE_EXPORT_CORPUS)
                }),
                globalError
            )
        )
    )
)


// Actions for uploading Documents while editing a corpus

export const IMPORT_ANNOTATED_CORPUS = "IMPORT_ANNOTATED_CORPUS";
export const RECEIVE_IMPORT_ANNOTATED_CORPUS = "RECEIVE_IMPORT_ANNOTATED_CORPUS";
export type ImportAnnotatedCorpusForm = {
    corpusName: string;
    importer: string;
    annotationSetName: string;
    files: File[];
};
export const importAnnotatedCorpus = createPayloadAction<ImportAnnotatedCorpusForm>(IMPORT_ANNOTATED_CORPUS)
export const importAnnotatedCorpusEpic = (action$, state$) => action$.pipe(
    ofType(IMPORT_ANNOTATED_CORPUS),
    map((action: PayloadAction<ImportAnnotatedCorpusForm>) => {
        let formData = new FormData()
        formData.append("importer", action.payload.importer)
        formData.append("corpusName", action.payload.corpusName);
        formData.append("annotationSetName", action.payload.annotationSetName);
        for (let file of action.payload.files) {
            formData.append("files", file, file.name)
        }
        return formData
    }),
    mergeMap((formData: FormData) => {
            return fromFetch(RequestBuilder.POST(`corpus/import`, formData, {})).pipe(
                toJson(
                    mergeMap(res => {
                        toast.success("Uploaded!")
                        return [
                            createFetchSuccessAction(RECEIVE_IMPORT_ANNOTATED_CORPUS)(res),
                        ]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_IMPORT_ANNOTATED_CORPUS))
                )
            )
        }
    )
)


// export const REQUEST_CORPUS_IMPORT = "REQUEST_CORPUS_IMPORT";
// export const RECEIVE_CORPUS_IMPORT = "RECEIVE_CORPUS_IMPORT";
//
// function requestCorpusUpload() {
//     return {
//         type: REQUEST_CORPUS_IMPORT,
//     }
// }
//
// function receiveCorpusUpload(result, status = FetchStatusType.success, error = null) {
//     return {
//         type: RECEIVE_CORPUS_IMPORT,
//         corpus: result.corpus,
//         receivedAt: Date.now(),
//         status: status,
//         error: error
//     }
// }
//
// /**
//  * Action creator for async uploading given files to given corpus.
//  * @param corpusId the id of the corpus the file belong to
//  * @param files the files
//  * @returns {Function}
//  */
// export function uploadCorpus(files) {
//     return (dispatch, getState) => {
//         dispatch(requestCorpusUpload())
//         let corpus = getState().activeCorpus.values;
//         let annotationSets = getState().activeCorpus.annotationSets.items;
//         let formData = new FormData()
//         for (let file of files) {
//             formData.append("file", file, file.name);
//             formData.append("name", corpus.name)
//             // TODO: allow multiple annotation sets
//             formData.append("annotationSet", annotationSets[0].name)
//         }
//
//         client.httpPost(`/import`, formData, {}, false)
//             .then(result => {
//                     dispatch(receiveCorpusUpload(result))
//                 }
//             )
//             .catch(error => dispatch(receiveCorpusUpload(null, FetchStatusType.error, error)))
//     }
// }