import AnnotationSet from "../../../backend/model/AnnotationSet";
import {ofType} from "redux-observable";
import {filter, map, mergeMap, switchMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, RequestBuilder} from "../../../backend/RequestBuilder";
import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    onTagFlipError,
    toJson,
} from "../Common";
import {toast} from "react-toastify";
import {setActiveAnnotationSetEditableAnnotation} from "./AnnotationActions";
import Annotation from "../../../backend/model/Annotation";
import {PayloadAction} from "../types";

export const SET_ACTIVE_ANNOTATION_SET = "SET_ACTIVE_ANNOTATION_SET";
export const setActiveAnnotationSet = createPayloadAction<AnnotationSet>(SET_ACTIVE_ANNOTATION_SET);
export const setActiveAnnotationSetEpic = action$ => action$.pipe(
    ofType(SET_ACTIVE_ANNOTATION_SET),
    filter((action: PayloadAction<AnnotationSet>) => (action.payload && action.payload.annotationSetId > 0)),
    map((action: PayloadAction<AnnotationSet>) => fetchActiveAnnotationSet(action.payload.annotationSetId))
)


export const RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET = "RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET";
export const SAVE_ACTIVE_ANNOTATION_SET = "SAVE_ACTIVE_ANNOTATION_SET";
export const saveAnnotationSet = createPayloadAction<AnnotationSet>(SAVE_ACTIVE_ANNOTATION_SET);
export const saveActiveAnnotationSetEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_ACTIVE_ANNOTATION_SET),
    mergeMap((action: PayloadAction<AnnotationSet>) => (
            fromFetch(RequestBuilder.REQUEST(`/annotationset`,
                action.payload.annotationSetId && action.payload.annotationSetId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
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

export const FETCH_ACTIVE_ANNOTATION_SET = "FETCH_ACTIVE_ANNOTATION_SET"
export const fetchActiveAnnotationSet = createPayloadAction<number>(FETCH_ACTIVE_ANNOTATION_SET);
export const fetchActiveAnnotationSetEpic = (action$, state$) => action$.pipe(
    ofType(FETCH_ACTIVE_ANNOTATION_SET),
    filter((action: PayloadAction<number>) => action.payload && action.payload > 0),
    switchMap((action: PayloadAction<number>) =>
        fromFetch(RequestBuilder.GET(`/annotationset/${action.payload}`)).pipe(
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


