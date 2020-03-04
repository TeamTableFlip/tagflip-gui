import fetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";
import {fetchCorpusAnnotationSets, fetchCorpusDocuments, reloadCorpus, SET_EDITABLE_CORPUS} from "./CorpusActions";

export const SET_ACTIVE_ANNOTATION_SET = "SET_ACTIVE_ANNOTATION_SET";

/**
 * Action creator for the action SET_ACTIVE_ANNOTATION_SET.
 *
 * @param corpus
 * @returns {{type: string, annotationSet: *}}
 */
export function setActiveAnnotationSet(annotationSet) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_ACTIVE_ANNOTATION_SET,
            annotationSet
        });
        if (annotationSet.s_id > 0) {
            dispatch(reloadAnnotationSet());
        }
    }
}


export const UPDATE_ANNOTATION_SET_FIELD = "UPDATE_ANNOTATION_SET_FIELD";

/**
 * Action creator for the action UPDATE_ANNOTATION_SET_FIELD.
 * @param field the field
 * @param value the new value
 * @returns {{field: *, type: *, value: *}}
 */
export function updateAnnotationSetField(field, value) {
    return {
        type: UPDATE_ANNOTATION_SET_FIELD,
        field,
        value
    }
}

// Actions for saving the editable AnnotationSet in the backend


export const REQUEST_ACTIVE_ANNOTATION_SET = "REQUEST_ACTIVE_ANNOTATION_SET";

/**
 * ActionCreator for the action REQUEST_ACTIVE_ANNOTATION_SET.
 * @returns {{type: *}}
 */
export function requestActiveAnnotationSet() {
    return {
        type: REQUEST_ACTIVE_ANNOTATION_SET
    }
}


export const RECEIVE_ACTIVE_ANNOTATION_SET = "RECEIVE_ACTIVE_ANNOTATION_SET";

/**
 * ActionCreator for the action RECEIVE_ACTIVE_ANNOTATION_SET.
 * @param annotationSet the annotation Set
 * @param status status of response
 * @param error error of response
 * @returns {{annotationSet: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveActiveAnnotationSet(annotationSet, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_ACTIVE_ANNOTATION_SET,
        annotationSet: annotationSet,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * ActionCreator for async saving AnnotationSet
 * @returns {Function}
 */
export function saveAnnotationSet() {
    return (dispatch, getState) => {
        dispatch(requestActiveAnnotationSet());
        let annotationSet = getState().activeAnnotationSet.values;

        // Decide whether to PUT for update or POST for create
        if (!annotationSet.s_id || annotationSet.s_id <= 0) {
            client.httpPost('/annotationset', annotationSet)
                .then(result => {
                    dispatch(receiveActiveAnnotationSet(result));
                })
                .catch(err => {
                    dispatch(receiveActiveAnnotationSet({}, fetchStatusType.error, err))
                });
        } else {
            client.httpPut(`/annotationset/${annotationSet.s_id}`, annotationSet)
                .then(result => {
                    dispatch(receiveActiveAnnotationSet(result));
                })
                .catch(err => {
                    dispatch(receiveActiveAnnotationSet({}, fetchStatusType.error, err))
                });
        }
    }
}

// Actions for updating the editable AnnotationSet

/**
 * ActionCreator for async reloading AnnotationSet
 * @returns {Function}
 */
export function reloadAnnotationSet() {
    return (dispatch, getState) => {
        let annotationSet = getState().activeAnnotationSet.values;
        if (annotationSet.s_id > 0) {
            dispatch(requestActiveAnnotationSet());
            client.httpGet(`/annotationset/${annotationSet.s_id}`)
                .then(result => {
                        dispatch(receiveActiveAnnotationSet(result));
                        dispatch(fetchAnnotations());
                    }
                )
                .catch(error => {
                    dispatch(receiveActiveAnnotationSet({}, fetchStatusType.error, error))
                });
        } else {
            dispatch(receiveActiveAnnotationSet(getState().emptyAnnotationSet));
        }
    }
}

// Actions for fetching Annotations


export const REQUEST_ANNOTATIONS = "REQUEST_ANNOTATIONS";

/**
 * ActionCreator for the action REQUEST_ANNOTATIONS.
 * @returns {{type: *}}
 */
export function requestAnnotations() {
    return {
        type: REQUEST_ANNOTATIONS,
    }
}


export const INVALIDATE_ANNOTATIONS = "INVALIDATE_ANNOTATIONS";

/**
 * ActionCreator for the action INVALIDATE_ANNOTATIONS.
 * @returns {{type: *}}
 */
export function invalidateAnnotations() {
    return {
        type: INVALIDATE_ANNOTATIONS,
    }
}


export const RECEIVE_ANNOTATIONS = "RECEIVE_ANNOTATIONS";

/**
 * ActionCreator for the action RECEIVE_ANNOTATIONS.
 * @param annotations the annotations
 * @param status reponse status
 * @param error reponse error
 * @returns {{annotations: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveAnnotations(annotations, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_ANNOTATIONS,
        annotations: annotations,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Action Creator for asyc fetch of all Annotations for currently active AnnotationSet.
 * @returns {Function}
 */
export function fetchAnnotations() {
    return (dispatch, getState) => {
        dispatch(requestAnnotations());
        let annotationSet = getState().activeAnnotationSet.values;
        if (annotationSet.s_id > 0) {
            client.httpGet(`/annotationset/${annotationSet.s_id}/annotation`)
                .then(result =>
                    dispatch(receiveAnnotations(result))
                )
                .catch(error =>
                    dispatch(receiveAnnotations([], fetchStatusType.error, error))
                );
        } else {
            dispatch(receiveAnnotations([]));
        }
    }
}

// Actions for deleting an Annotation


export const DELETE_ANNOTATION = "DELETE_ANNOTATION";

/**
 * ActionCreator for async delete of annotation.
 * @param annotationId the id of the Annotation
 * @returns {Function}
 */
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


export const SET_EDITABLE_ANNOTATION = "SET_EDITABLE_ANNOTATION";

/**
 * ActionCreator for the action SET_EDITABLE_ANNOTATION.
 *
 * @param annotation the annotation
 * @returns {{annotation: *, type: *}}
 */
export function setEditableAnnotation(annotation) {
    return {
        type: SET_EDITABLE_ANNOTATION,
        annotation: annotation
    }
}


export const UPDATE_ANNOTATION_FIELD = "UPDATE_ANNOTATION_FIELD";

/**
 * ActionCreator for the action UPDATE_ANNOTATION_FIELD.
 * @param field the field
 * @param value the value
 * @returns {{field: *, type: *, value: *}}
 */
export function updateAnnotationField(field, value) {
    return {
        type: UPDATE_ANNOTATION_FIELD,
        field,
        value
    }
}

// Actions for saving the editable Annotation in the backend


export const REQUEST_SAVE_ANNOTATION = "REQUEST_SAVE_ANNOTATION";

/**
 * ActionCreator for the action REQUEST_SAVE_ANNOTATION.
 * @returns {{type: *}}
 */
export function requestEditableAnnotation() {
    return {
        type: REQUEST_SAVE_ANNOTATION
    }
}


export const RECEIVE_SAVE_ANNOTATION = "RECEIVE_SAVE_ANNOTATION";

/**
 * ActionCreator for the action RECEIVE_SAVE_ANNOTATION.
 * @param annotation the Annotation
 * @param status response status
 * @param error response error
 * @returns {{annotation: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveSaveAnnotation(annotation, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_SAVE_ANNOTATION,
        annotation: annotation,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * ActionCreator for async saving current active edited Annotation.
 * @returns {Function}
 */
export function saveAnnotation() {
    return (dispatch, getState) => {
        dispatch(requestEditableAnnotation());
        let annotation = getState().activeAnnotationSet.annotations.editableAnnotation.values;

        // Decide whether to PUT for update or POST for create
        if (!annotation.a_id || annotation.a_id <= 0) {
            client.httpPost('/annotation', annotation)
                .then(result => {
                    dispatch(receiveSaveAnnotation(result))
                })
                .catch(err => {
                    dispatch(receiveSaveAnnotation({}, fetchStatusType.error, err))
                });
        } else {
            client.httpPut(`/annotation/${annotation.a_id}`, annotation)
                .then(result => {
                    dispatch(receiveSaveAnnotation(result));
                })
                .catch(err => {
                    dispatch(receiveSaveAnnotation({}, fetchStatusType.error, err))
                });
        }
    }
}

// Actions for reloading an Annotation

/**
 * ActionCreator for async reloading current active edited Annotation.
 * @returns {Function}
 */
export function reloadAnnotation() {
    return (dispatch, getState) => {
        let annotation = getState().activeAnnotationSet.annotations.editableAnnotation.values;
        if (annotation.a_id > 0) {
            dispatch(requestEditableAnnotation());
            client.httpGet(`/corpus/${annotation.c_id}`)
                .then(result => {
                    dispatch(receiveEditableAnnotation(result));
                })
                .catch(error => dispatch(receiveEditableAnnotation({}, fetchStatusType.error, error)));
        } else {
            dispatch(receiveEditableAnnotation(getState().emptyAnnotation));
        }
    }
}