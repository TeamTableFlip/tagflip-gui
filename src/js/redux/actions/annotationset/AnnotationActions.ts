// Actions for fetching Annotations


import {
    BaseAction,
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse, onTagFlipError,
    PayloadAction,
    toJson
} from "../Common";
import Annotation from "../../../backend/model/Annotation";
import {createAction} from "@reduxjs/toolkit";
import {ofType} from "redux-observable";
import {filter, map, mergeMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, RequestBuilder} from "../../../backend/RequestBuilder";
import {toast} from "react-toastify";
import {RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET} from "./AnnotationSetActions";


export const FETCH_ACTIVE_ANNOTATIONSET_ANNOTATIONS = "FETCH_ACTIVE_ANNOTATIONSET_ANNOTATIONS";
export const RECEIVE_ACTIVE_ANNOTATIONSET_ANNOTATIONS = "RECEIVE_ACTIVE_ANNOTATIONSET_ANNOTATIONS";
export const fetchActiveAnnotationSetAnnotations = createAction(FETCH_ACTIVE_ANNOTATIONSET_ANNOTATIONS);
export const fetchActiveAnnotationSetAnnotationsEpic = (action$, state$) => action$.pipe(
    ofType(RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET, FETCH_ACTIVE_ANNOTATIONSET_ANNOTATIONS),
    filter(() => state$.value.activeAnnotationSet.values.annotationSetId > 0),
    mergeMap((action: BaseAction) => (
            fromFetch(RequestBuilder.GET(`/annotationset/${state$.value.activeAnnotationSet.values.annotationSetId}/annotation`)).pipe(
                toJson(map((res: Annotation[]) => createFetchSuccessAction<Annotation[]>(RECEIVE_ACTIVE_ANNOTATIONSET_ANNOTATIONS)(res)),
                    onTagFlipError(createFetchErrorAction(RECEIVE_ACTIVE_ANNOTATIONSET_ANNOTATIONS)))
            )
        )
    )
);

// Actions for deleting an Annotation

export const DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION = "DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION";
export const RECEIVE_DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION = "RECEIVE_DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION";
export const deleteActiveAnnotationSetAnnotation = createPayloadAction<number>(DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION);
export const deleteActiveAnnotationSetAnnotationEpic = (action$, state$) => action$.pipe(
    ofType(DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION),
    filter(() => state$.value.activeAnnotationSet.values.annotationSetId > 0),
    mergeMap((action: PayloadAction<number>) => (
            fromFetch(RequestBuilder.DELETE(`/annotationset/${state$.value.activeAnnotationSet.values.annotationSetId}/annotation/${action.payload}`)).pipe(
                handleResponse(
                    map(
                        (_: Response) => {
                            toast.info("DELETED!");
                            return createPayloadAction<number>(RECEIVE_DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION)(action.payload)
                        }
                    ),
                    onTagFlipError(createFetchErrorAction(RECEIVE_ACTIVE_ANNOTATIONSET_ANNOTATIONS))
                )
            )
        )
    )
);

export const SET_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION = "SET_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION";
export const setActiveAnnotationSetEditableAnnotation = createPayloadAction<Annotation>(SET_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION)


export const UPDATE_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION = "UPDATE_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION";
export const updateActiveAnnotationSetEditableAnnotationField = (field, value) => {
    return {
        type: UPDATE_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION,
        payload: {
            field,
            value
        }
    }
}


export const SAVE_ANNOTATION = "SAVE_ANNOTATION";
export const RECEIVE_SAVE_ANNOTATION = "RECEIVE_SAVE_ANNOTATION";
export const saveActiveAnnotationSetAnnotation = createPayloadAction<Annotation>(SAVE_ANNOTATION);
export const saveActiveAnnotationSetAnnotationEpic = (action$, state$) => action$.pipe(
    ofType(SAVE_ANNOTATION),
    filter(() => state$.value.activeAnnotationSet.values.annotationSetId > 0),
    mergeMap((action: PayloadAction<Annotation>) => (
            fromFetch(RequestBuilder.REQUEST(`/annotationset/${state$.value.activeAnnotationSet.values.annotationSetId}/annotation`,
                action.payload.annotationId && action.payload.annotationId > 0 ?
                    HttpMethod.PUT : HttpMethod.POST, action.payload)).pipe(
                toJson(map((res: Annotation) => {
                        toast.success("Saved!");
                        return createFetchSuccessAction<Annotation>(RECEIVE_SAVE_ANNOTATION)(res)
                    }),
                    onTagFlipError(createFetchErrorAction(RECEIVE_SAVE_ANNOTATION))
                )
            )
        )
    )
);


// /**
//  * ActionCreator for async saving current active edited Annotation.
//  * @returns {Function}
//  */
// export function saveAnnotation() {
//     return (dispatch, getState) => {
//         dispatch(requestEditableAnnotation());
//         const activeAnnotationSetId = getState().activeAnnotationSet.values.annotationSetId;
//         let annotation = getState().activeAnnotationSet.annotations.editableAnnotation.values;
//
//         // Decide whether to PUT for update or POST for create
//         if (!annotation.annotationId || annotation.annotationId <= 0) {
//             client.httpPost(`/annotationset/${activeAnnotationSetId}/annotation`, annotation)
//                 .then(result => {
//                     dispatch(receiveSaveAnnotation(result))
//                 })
//                 .catch(err => {
//                     dispatch(receiveSaveAnnotation({}, FetchStatusType.error, err))
//                 });
//         } else {
//             client.httpPut(`/annotationset/${activeAnnotationSetId}/annotation`, annotation)
//                 .then(result => {
//                     dispatch(receiveSaveAnnotation(result));
//                 })
//                 .catch(err => {
//                     dispatch(receiveSaveAnnotation({}, FetchStatusType.error, err))
//                 });
//         }
//     }
// }
