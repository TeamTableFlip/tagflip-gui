import fetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";

// Actions for setting the current Annotation

export const SET_EDITABLE_ANNOTATION = "SET_EDITABLE_ANNOTATION";
export function setEditableAnnotation(annotation) {
    return {
        type: SET_EDITABLE_ANNOTATION,
        annotationSet: annotation
    }
}

export const UPDATE_ANNOTATION_FIELD = "UPDATE_ANNOTATION_FIELD";
export function updateAnnotationField(field, value) {
    return {
        type: UPDATE_ANNOTATION_FIELD,
        field,
        value
    }
}

// Actions for saving the editable Annotation in the backend

export const REQUEST_EDITABLE_ANNOTATION = "REQUEST_EDITABLE_ANNOTATION";
export function requestEditableAnnotation() {
    return {
        type: REQUEST_EDITABLE_ANNOTATION
    }
}

export const RECEIVE_EDITABLE_ANNOTATION = "RECEIVE_EDITABLE_ANNOTATION";
export function receiveEditableAnnotation(annotation, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_EDITABLE_ANNOTATION,
        annotation: annotation,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export function saveAnnotation() {
    return (dispatch, getState) => {
        dispatch(requestEditableAnnotation());
        let annotation = getState().editableAnnotation.data.values;

        // Decide whether to PUT for update or POST for create
        if(!annotation.a_id || annotation.a_id <= 0) {
            client.httpPost('/annotation', annotation)
                .then(result =>
                    dispatch(receiveEditableAnnotation(result))
                )
                .catch(err =>
                    dispatch(receiveEditableAnnotation({}, fetchStatusType.error, err))
                );
        }
        else {
            client.httpPut(`/annotation/${annotation.a_id}`, annotation)
                .then(result =>
                    dispatch(receiveEditableAnnotation(result))
                )
                .catch(err =>
                    dispatch(receiveEditableAnnotation({}, fetchStatusType.error, err))
                );
        }
        // dispatch(reloadAnnotation());
    }
}

// Actions for reloading an Annotation

export function reloadAnnotation() {
    return (dispatch, getState) => {
        let annotation = getState().editableAnnotation.data.values;
        if (annotation.a_id > 0) {
            dispatch(requestEditableAnnotation());
            client.httpGet(`/corpus/${annotation.c_id}`)
                .then(result => {
                    dispatch(receiveEditableAnnotation(result));
                })
                .catch(error => dispatch(receiveEditableAnnotation({}, fetchStatusType.error, error)));
        }
        else {
            dispatch(receiveEditableAnnotation(getState().emptyAnnotation));
        }
    }
}

// Actions for deleting an Annotation() {


// Actions for deleting Annotation Sets
export const DELETE_ANNOTATION = "DELETE_ANNOTATION";

export function deleteAnnotation(annotationId) {
    return (dispatch, getState) => {
        client.httpDelete(`/annotation/${annotationId}`)
            .then(result => {
                return dispatch({
                    type: DELETE_ANNOTATION,
                    annotationId: annotationId
                });
            })
            .catch(err => {
                dispatch(receiveEditableAnnotation({}, fetchStatusType.error, err))
            });
    }
}