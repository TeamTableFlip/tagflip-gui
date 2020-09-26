import {ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {RequestBuilder, SimpleQueryParam} from "../../../backend/RequestBuilder";
import {createFetchErrorAction, createFetchSuccessAction, onTagFlipError, toJson} from "../Common";
import {BaseAction} from "../types";
import AnnotationTaskState from "../../../backend/model/AnnotationTaskState";
import {createAction} from "@reduxjs/toolkit";

export const FETCH_ANNOTATION_TASK_STATES = "FETCH_ANNOTATION_TASK_STATES";
export const RECEIVE_ANNOTATION_TASK_STATES = "RECEIVE_ANNOTATION_TASK_STATES";
export const fetchAnnotationTaskStates = createAction(FETCH_ANNOTATION_TASK_STATES);
export const fetchAnnotationTasksStatesEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ANNOTATION_TASK_STATES),
    mergeMap((action: BaseAction) => (
            fromFetch(RequestBuilder.GET(`/annotationtask/states`)).pipe(
                toJson(mergeMap((res: AnnotationTaskState[]) => {
                        return [createFetchSuccessAction<AnnotationTaskState[]>(RECEIVE_ANNOTATION_TASK_STATES)(res)]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_ANNOTATION_TASK_STATES))
                )
            )
        )
    )
)
