import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    toJson, toText
} from "../Common";
import Document from "../../../backend/model/Document";
import {ofType} from "redux-observable";
import {filter, map, mergeMap, switchMap} from "rxjs/operators";
import {BaseAction, PayloadAction} from "../types";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, QueryParam, RequestBuilder, SimpleQueryParam} from "../../../backend/RequestBuilder";
import AnnotationTask from "../../../backend/model/AnnotationTask";
import {toast} from "react-toastify";
import {fetchActiveCorpus, setActiveCorpus} from "../corpus/CorpusActions";
import AnnotationTaskDocument from "../../../backend/model/AnnotationTaskDocument";
import {createAction} from "@reduxjs/toolkit";
import Tag from "../../../backend/model/Tag";


export const RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK = "RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK";


export const SAVE_ANNOTATION_TASK = "SAVE_ANNOTATION_TASK";
export const saveAnnotationTask = createPayloadAction<AnnotationTask>(SAVE_ANNOTATION_TASK);
export const saveAnnotationTaskEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_ANNOTATION_TASK),
    mergeMap((action: PayloadAction<AnnotationTask>) => (
            fromFetch(RequestBuilder.REQUEST(`/annotationtask`,
                action.payload.annotationTaskId && action.payload.annotationTaskId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
                toJson(mergeMap((res: AnnotationTask) => {
                        return [fetchActiveAnnotationTask(res.annotationTaskId)]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK))
                )
            )
        )
    )
)

export const SAVE_ANNOTATION_TASK_WITH_DOCUMENTS = "SAVE_ANNOTATION_TASK_WITH_DOCUMENTS";
export const saveAnnotationTaskWithDocuments = createPayloadAction<{annotationTask : AnnotationTask, documents: Document[]}>(SAVE_ANNOTATION_TASK_WITH_DOCUMENTS);
export const saveAnnotationTaskWithDocumentsEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_ANNOTATION_TASK_WITH_DOCUMENTS),
    mergeMap((action: PayloadAction<{annotationTask : AnnotationTask, documents: Document[]}>) => (
            fromFetch(RequestBuilder.REQUEST(`/annotationtask`,
                action.payload.annotationTask.annotationTaskId && action.payload.annotationTask.annotationTaskId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, action.payload.annotationTask)).pipe(
                toJson(mergeMap((res: AnnotationTask) => {
                        toast.success("Saved!");
                        let documentSaveActions = action.payload.documents.map((doc : Document) => assignDocumentToAnnotationTask(doc.documentId))
                        return [
                            createFetchSuccessAction<AnnotationTask>(RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK)(res),
                            ... documentSaveActions
                        ]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK))
                )
            )
        )
    )
)


export const SET_ACTIVE_ANNOTATION_TASK = "SET_ACTIVE_ANNOTATION_TASK";
export const setActiveAnnotationTask = createPayloadAction<AnnotationTask>(SET_ACTIVE_ANNOTATION_TASK);
export const setActiveAnnotationTaskEpic = action$ => action$.pipe(
    ofType(SET_ACTIVE_ANNOTATION_TASK),
    filter((action: PayloadAction<AnnotationTask>) => (action.payload.annotationTaskId > 0)),
    mergeMap((action: PayloadAction<AnnotationTask>) => {
        let actions = [fetchActiveAnnotationTask(action.payload.annotationTaskId)]
        if(action.payload.corpusId > 0) {
            actions.push(fetchActiveCorpus(action.payload.corpusId))
        }
        return actions;
    })
)

export const FETCH_ACTIVE_ANNOTATION_TASK = "FETCH_ACTIVE_ANNOTATION_TASK";
export const fetchActiveAnnotationTask = createPayloadAction<number>(FETCH_ACTIVE_ANNOTATION_TASK)
export const fetchActiveAnnotationTaskEpic = action$ => action$.pipe(
    ofType(FETCH_ACTIVE_ANNOTATION_TASK),
    filter((action: PayloadAction<number>) => action.payload && action.payload > 0),
    mergeMap((action:  PayloadAction<number>) =>
        fromFetch(RequestBuilder.GET(`/annotationtask/${action.payload}`)).pipe(
            toJson(
                mergeMap((res: AnnotationTask) => (
                    [createFetchSuccessAction<AnnotationTask>(RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK)(res), setActiveCorpus(res.corpus)]
                )),
                onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK))
            )
        )
    ),
)

export const ASSIGN_DOCUMENT_TO_ANNOTATION_TASK = "ASSIGN_DOCUMENT_TO_ANNOTATIONTASK";
export const RECEIVE_ASSIGN_DOCUMENT_TO_ANNOTATION_TASK = "RECEIVE_ASSIGN_DOCUMENT_TO_ANNOTATION_TASK";
export const assignDocumentToAnnotationTask = createPayloadAction<number>(ASSIGN_DOCUMENT_TO_ANNOTATION_TASK)
export const assignDocumentToAnnotationTaskEpic = (action$, state$) => action$.pipe(
    ofType(ASSIGN_DOCUMENT_TO_ANNOTATION_TASK),
    filter((action: PayloadAction<number>) => action.payload && action.payload > 0),
    mergeMap((action:  PayloadAction<AnnotationTaskDocument>) =>
        fromFetch(RequestBuilder.PUT(`/annotationtask/${state$.value.activeAnnotationTask.values.annotationTaskId}/document/${action.payload}`)).pipe(
            toJson(
                mergeMap((res: AnnotationTaskDocument[]) => (
                    [createFetchSuccessAction<AnnotationTaskDocument[]>(RECEIVE_ASSIGN_DOCUMENT_TO_ANNOTATION_TASK)(res)]
                )),
                onTagFlipError(createFetchErrorAction(RECEIVE_ASSIGN_DOCUMENT_TO_ANNOTATION_TASK))
            )
        )
    ),
)

export const SAVE_ANNOTATION_TASK_DOCUMENT = "SAVE_ANNOTATION_TASK_DOCUMENT";
export const saveAnnotationTaskDocument = createPayloadAction<AnnotationTaskDocument>(SAVE_ANNOTATION_TASK_DOCUMENT)
export const saveAnnotationTaskDocumentEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_ANNOTATION_TASK_DOCUMENT),
    filter((action: PayloadAction<AnnotationTaskDocument>) => action.payload && action.payload.annotationTaskDocumentId > 0),
    mergeMap((action:  PayloadAction<AnnotationTaskDocument>) =>
        fromFetch(RequestBuilder.REQUEST(`/annotationtaskdocument`, action.payload.annotationTaskDocumentId && action.payload.annotationTaskDocumentId > 0 ?
            HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
            toJson(
                mergeMap((res: AnnotationTaskDocument) => (
                    [
                        createFetchSuccessAction<AnnotationTaskDocument>(RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT)(res),
                        fetchActiveAnnotationTask(res.annotationTaskId)
                    ]
                )),
                onTagFlipError(createFetchErrorAction(RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT))
            )
        )
    ),
)


// Actions for getting Annotation Task Documents
export const FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENTS = "FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENTS";
export const RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENTS = "RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENTS";
export const fetchActiveAnnotationTaskDocuments = createPayloadAction<QueryParam[]>(FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENTS);
export const fetchActiveAnnotationTaskDocumentsEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENTS),
    filter(() => state$.value.activeAnnotationTask.values && state$.value.activeAnnotationTask.values.annotationTaskId > 0),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET(`/annotationtask/${state$.value.activeAnnotationTask.values.annotationTaskId}/document`, action.payload)).pipe(
            toJson(
                mergeMap((res: AnnotationTaskDocument[]) => [
                    fetchActiveAnnotationTaskDocumentCount(action.payload),
                    createFetchSuccessAction<AnnotationTaskDocument[]>(RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENTS)(res)
                ] ),
                createFetchErrorAction(RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENTS)
            )
        )
    )
)

export const FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT = "FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT";
export const RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT = "RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT";
export const fetchActiveAnnotationTaskDocumentCount = createPayloadAction<QueryParam[]>(FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT);
export const fetchActiveAnnotationTaskDocumentCountEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT),
    filter(() => state$.value.activeAnnotationTask.values.annotationTaskId > 0),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET(`/annotationtask/${state$.value.activeAnnotationTask.values.annotationTaskId}/document`, [SimpleQueryParam.of("count", true), ... (action.payload || [])])).pipe(
            handleResponse(
                toText(
                    map((res: string) => createFetchSuccessAction<number>(RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT)(Number.parseInt(res)))
                )
            )
        )
    )
)

export const FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT = "FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT";
export const RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT = "RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT";
export const fetchActiveAnnotationTaskDocument = createPayloadAction<number>(FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT);
export const fetchActiveAnnotationTaskDocumentEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT),
    filter((action: PayloadAction<number>) => action.payload > 0),
    filter(() => state$.value.activeAnnotationTask.values.annotationTaskId > 0),
    switchMap((action: PayloadAction<number>) =>
        fromFetch(RequestBuilder.GET(`/annotationtaskdocument/${action.payload}`)).pipe(
            toJson(
                mergeMap((res: AnnotationTaskDocument) => [
                        createFetchSuccessAction<AnnotationTaskDocument>(RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT)(res)
                ]),
                createFetchErrorAction(RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT)
            )
        )
    )
)


export const SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT = "SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT"
export const RECEIVE_SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT = "RECEIVE_SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT";
export const saveTagForActiveAnnotationTaskDocument = createPayloadAction<Tag>(SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT);
export const saveTagForActiveAnnotationTaskDocumentEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT),
    mergeMap((action: PayloadAction<Tag>) => {
            let documentId = state$.value.activeAnnotationTask.activeDocument.values.documentId
            action.payload.annotationTaskId = state$.value.activeAnnotationTask.values.annotationTaskId

            return fromFetch(RequestBuilder.REQUEST(`/document/${documentId}/tag`,
                action.payload.tagId && action.payload.tagId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
                toJson(map((res: Tag) => createFetchSuccessAction(RECEIVE_SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT)(res)),
                    onTagFlipError(createFetchErrorAction(RECEIVE_SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT))
                )
            )
        }
    )
)

export const FETCH_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT = "FETCH_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT"
export const RECEIVE_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT = "RECEIVE_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT";
export const fetchTagsForActiveAnnotationTaskDocument = createAction(FETCH_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT);
export const fetchTagsForActiveAnnotationTaskDocumentEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT),
    mergeMap((action: PayloadAction<Tag>) => {
            let corpusId = state$.value.activeAnnotationTask.values.corpusId
            let documentId = state$.value.activeAnnotationTask.activeDocument.values.documentId
            return fromFetch(RequestBuilder.GET(`/document/${documentId}/tag`, [SimpleQueryParam.of("annotationTaskId", state$.value.activeAnnotationTask.values.annotationTaskId)])).pipe(
                toJson(
                    map((res: Tag[]) => {
                        return createFetchSuccessAction<Tag[]>(RECEIVE_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT)(res)
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT))
                )
            )
        }
    )
)
