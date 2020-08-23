import { createAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { RequestBuilder } from "../../../backend/RequestBuilder";
import {
    BaseAction,
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError, toJson,
} from "../Common";
import { toast } from "react-toastify";
import AnnotationSet from "../../../backend/model/AnnotationSet";

export const FETCH_ANNOTATION_SETS = "FETCH_ANNOTATION_SETS"
export const RECEIVE_ANNOTATION_SETS = "RECEIVE_ANNOTATION_SETS";
export const fetchAnnotationSets = createAction(FETCH_ANNOTATION_SETS)
export const fetchAnnotationSetsEpic = action$ => action$.pipe(
    ofType(FETCH_ANNOTATION_SETS),
    mergeMap(action =>
        fromFetch(RequestBuilder.GET("annotationset")).pipe(
            toJson(
                map((res: AnnotationSet[]) => createFetchSuccessAction(RECEIVE_ANNOTATION_SETS)(res)),
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
        fromFetch(RequestBuilder.DELETE(`annotationset/${action.payload}`)).pipe(
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
