import AnnotationSet from "../../../backend/model/AnnotationSet";
import {ofType} from "redux-observable";
import {filter, map, mergeMap, switchMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, RequestBuilder} from "../../../backend/RequestBuilder";
import {
    BaseAction,
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    onTagFlipError,
    toJson,
} from "../Common";
import {toast} from "react-toastify";
import {createAction} from "@reduxjs/toolkit";
import {setActiveAnnotationSetEditableAnnotation} from "./AnnotationActions";
import Annotation from "../../../backend/model/Annotation";

export const SET_ACTIVE_ANNOTATION_SET = "SET_ACTIVE_ANNOTATION_SET";
export const FETCH_ACTIVE_ANNOTATION_SET = "FETCH_ACTIVE_ANNOTATION_SET"

export const setActiveAnnotationSet = createPayloadAction<AnnotationSet>(SET_ACTIVE_ANNOTATION_SET);
export const setActiveAnnotationSetEpic = action$ => action$.pipe(
    ofType(SET_ACTIVE_ANNOTATION_SET),
    filter((action: BaseAction) => (action.payload.annotationSetId > 0)),
    map((action: BaseAction) => fetchActiveAnnotationSet())
)

export const UPDATE_ANNOTATION_SET_FIELD = "UPDATE_ANNOTATION_SET_FIELD";
export const updateActiveAnnotationSetField = (field, value) => ({
    type: UPDATE_ANNOTATION_SET_FIELD,
    payload: {
        field,
        value
    }
})


export const RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET = "RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET";

export const SAVE_ACTIVE_ANNOTATION_SET = "SAVE_ACTIVE_ANNOTATION_SET";
export const saveActiveAnnotationSet = createAction(SAVE_ACTIVE_ANNOTATION_SET);
export const saveActiveAnnotationSetEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_ACTIVE_ANNOTATION_SET),
    mergeMap((action: BaseAction) => (
            fromFetch(RequestBuilder.REQUEST(`/annotationset`,
                state$.value.activeAnnotationSet.values.annotationSetId && state$.value.activeAnnotationSet.values.annotationSetId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, state$.value.activeAnnotationSet.values)).pipe(
                toJson(mergeMap((res: AnnotationSet) => {
                        toast.success("Saved!");
                        return[
                            createFetchSuccessAction<AnnotationSet>(RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET)(res),
                            setActiveAnnotationSetEditableAnnotation(Annotation.create())
                        ]
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET)))
            )
        )
    )
);

export const fetchActiveAnnotationSet = createAction(FETCH_ACTIVE_ANNOTATION_SET);
export const fetchActiveAnnotationSetEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_ANNOTATION_SET),
    filter((action: BaseAction) => state$.value.activeAnnotationSet.values.annotationSetId && state$.value.activeAnnotationSet.values.annotationSetId > 0),
    switchMap((action: BaseAction) =>
        fromFetch(RequestBuilder.GET(`/annotationset/${state$.value.activeAnnotationSet.values.annotationSetId}`)).pipe(
            toJson(
                mergeMap((res: AnnotationSet) => [
                    createFetchSuccessAction<AnnotationSet>(RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET)(res),
                    setActiveAnnotationSetEditableAnnotation(Annotation.create())
                ]),
                onTagFlipError(createFetchErrorAction(RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET))
            )
        )
    )
)


