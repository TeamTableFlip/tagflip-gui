import {createAction} from "@reduxjs/toolkit";
import {ofType} from "redux-observable";
import {map, mergeMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {QueryParam, RequestBuilder, SimpleQueryParam} from "../../../backend/RequestBuilder";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError, toJson, toText,
} from "../Common";
import {toast} from "react-toastify";
import AnnotationSet from "../../../backend/model/AnnotationSet";
import {BaseAction, PayloadAction} from "../types";

export const FETCH_ANNOTATION_SET_COUNT = "FETCH_ANNOTATION_SET_COUNT";
export const RECEIVE_ANNOTATION_SET_COUNT = "RECEIVE_ANNOTATION_SET_COUNT";
export const fetchAnnotationSetCount = createPayloadAction<QueryParam[]>(FETCH_ANNOTATION_SET_COUNT);
export const fetchCorporaCountEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ANNOTATION_SET_COUNT),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET(`/annotationset`, [SimpleQueryParam.of("count", true), ...(action.payload || [])])).pipe(
            handleResponse(
                toText(
                    map((res: string) => createFetchSuccessAction<number>(RECEIVE_ANNOTATION_SET_COUNT)(Number.parseInt(res)))
                )
            )
        )
    )
)

export const FETCH_ANNOTATION_SETS = "FETCH_ANNOTATION_SETS"
export const RECEIVE_ANNOTATION_SETS = "RECEIVE_ANNOTATION_SETS";
export const fetchAnnotationSets = createPayloadAction<QueryParam[]>(FETCH_ANNOTATION_SETS)
export const fetchAnnotationSetsEpic = action$ => action$.pipe(
    ofType(FETCH_ANNOTATION_SETS),
    mergeMap((action: PayloadAction<QueryParam[]>) =>
        fromFetch(RequestBuilder.GET("/annotationset", action.payload)).pipe(
            toJson(
                mergeMap((res: AnnotationSet[]) =>
                    [fetchAnnotationSetCount(action.payload), createFetchSuccessAction(RECEIVE_ANNOTATION_SETS)(res)]
                ),
                onTagFlipError(createFetchErrorAction(RECEIVE_ANNOTATION_SETS))
            )
        )
    )
)


// Actions for deleting Annotation Sets
export const DELETE_ANNOTATION_SET = "DELETE_ANNOTATION_SET";
export const RECEIVE_DELETE_ANNOTATION_SET = "RECEIVE_DELETE_ANNOTATION_SET";

export const deleteAnnotationSet = createPayloadAction<number>(DELETE_ANNOTATION_SET)
export const deleteAnnotationSetEpic = action$ => action$.pipe(
    ofType(DELETE_ANNOTATION_SET),
    mergeMap((action: BaseAction) =>
        fromFetch(RequestBuilder.DELETE(`/annotationset/${action.payload}`)).pipe(
            handleResponse(
                map((_) => {
                    toast.info("Deleted!")
                    return createFetchSuccessAction(RECEIVE_DELETE_ANNOTATION_SET)(action.payload)
                }),
                onTagFlipError(() => createFetchErrorAction(RECEIVE_DELETE_ANNOTATION_SET)(action.payload))
            )
        )
    )
)
