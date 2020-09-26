import {ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {RequestBuilder, SimpleQueryParam} from "../../../backend/RequestBuilder";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    toJson
} from "../Common";
import {BaseAction, PayloadAction} from "../types";
import AnnotationTask from "../../../backend/model/AnnotationTask";
import {createAction} from "@reduxjs/toolkit";

export const GENERATE_ANNOTATION_TASKS = "GENERATE_ANNOTATION_TASKS";
export const RECEIVE_GENERATE_ANNOTATION_TASKS = "RECEIVE_GENERATE_ANNOTATION_TASKS";
export const generateAnnotationTasks = createPayloadAction<{ corpusId: number, partitions: number }>(GENERATE_ANNOTATION_TASKS);
export const generateAnnotationTasksEpic = (action$, state$) => action$.pipe(
    ofType(GENERATE_ANNOTATION_TASKS),
    mergeMap((action: PayloadAction<{ corpusId: number, partitions: number }>) => (
            fromFetch(RequestBuilder.POST(`/annotationtask/generate/${action.payload.corpusId}/${action.payload.partitions}`, SimpleQueryParam.of("withMeta", true))).pipe(
                mergeMap((res: Response) => {
                    return [fetchAnnotationTasks()];
                })
            )
        )
    )
)

export const FETCH_ANNOTATION_TASKS = "FETCH_ANNOTATION_TASKS";
export const RECEIVE_ANNOTATION_TASKS = "RECEIVE_ANNOTATION_TASKS";
export const fetchAnnotationTasks = createAction(FETCH_ANNOTATION_TASKS);
export const fetchAnnotationTasksEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ANNOTATION_TASKS),
    mergeMap((action: BaseAction) => (
            fromFetch(RequestBuilder.GET(`/annotationtask`, [SimpleQueryParam.of("withMeta", true)])).pipe(
                toJson(mergeMap((res: AnnotationTask[]) => {
                        return [createFetchSuccessAction<AnnotationTask[]>(RECEIVE_ANNOTATION_TASKS)(res)]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_ANNOTATION_TASKS))
                )
            )
        )
    )
)

export const DELETE_ANNOTATION_TASK = "DELETE_ANNOTATION_TASK";
export const RECEIVE_DELETE_ANNOTATION_TASK = "RECEIVE_DELETE_ANNOTATION_TASK";
export const deleteAnnotationTask = createPayloadAction<number>(DELETE_ANNOTATION_TASK);
export const deleteAnnotationTaskEpic = (action$, state$) => action$.pipe(
    ofType(DELETE_ANNOTATION_TASK),
    mergeMap((action: PayloadAction<number>) => (
            fromFetch(RequestBuilder.DELETE(`/annotationtask/${action.payload}`)).pipe(
                handleResponse(mergeMap((res: any) => {
                        return [createFetchSuccessAction<number>(RECEIVE_DELETE_ANNOTATION_TASK)(action.payload)]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_DELETE_ANNOTATION_TASK))
                )
            )
        )
    )
)

