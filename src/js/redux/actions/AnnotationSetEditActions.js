import fetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";
import {fetchCorpusAnnotationSets, receiveUpdateCorpus, requestUpdateCorpus} from "./CorpusEditActions";

/**
 * Action creator for the action SET_SELECTED_ANNOTATION_SET.
 *
 * @param corpus
 * @returns {{type: string, annotationSet: *}}
 */
export const SET_SELECTED_ANNOTATION_SET = "SET_SELECTED_ANNOTATION_SET";
export function setEditableAnnotationSet(annotationSet) {
    return {
        type: SET_SELECTED_ANNOTATION_SET,
        annotationSet
    }
}

export const UPDATE_ANNOTATION_SET_FIELD = "UPDATE_ANNOTATION_SET_FIELD";
export function updateAnnotationSetField(field, value) {
    return {
        type: UPDATE_ANNOTATION_SET_FIELD,
        field,
        value
    }
}

// Actions for saving the editable AnnotationSet in the backend

export const REQUEST_EDITABLE_ANNOTATION_SET = "REQUEST_EDITABLE_ANNOTATION_SET";
export function requestEditableAnnotationSet() {
    return {
        type: REQUEST_EDITABLE_ANNOTATION_SET
    }
}

export const RECEIVE_EDITABLE_ANNOTATION_SET = "RECEIVE_EDITABLE_ANNOTATION_SET";
export function receiveEditableAnnotationSet(annotationSet, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_EDITABLE_ANNOTATION_SET,
        annotationSet: annotationSet,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export function saveAnnotationSet() {
    return (dispatch, getState) => {
        dispatch(requestEditableAnnotationSet());
        let annotationSet = getState().editableAnnotationSet.data.values;

        // Decide whether to PUT for update or POST for create
        if(!annotationSet.s_id || annotationSet.s_id <= 0) {
            client.httpPost('/annotationset', annotationSet)
                .then(result =>
                    dispatch(receiveEditableAnnotationSet(result))
                )
                .catch(err =>
                    dispatch(receiveEditableAnnotationSet({}, fetchStatusType.error, err))
                );
        }
        else {
            client.httpPut(`/annotationset/${annotationSet.s_id}`, annotationSet)
                .then(result =>
                    dispatch(receiveEditableAnnotationSet(result))
                )
                .catch(err =>
                    dispatch(receiveEditableAnnotationSet({}, fetchStatusType.error, err))
                );
        }
    }
}

// Actions for updating the editable AnnotationSet

export function reloadAnnotationSet() {
    return (dispatch, getState) => {
        dispatch(requestEditableAnnotationSet());
        let annotationSet = getState().editableAnnotationSet.data.values;
        if (annotationSet.s_id > 0) {
            dispatch(requestEditableAnnotationSet());
            client.httpGet(`/annotationset/${annotationSet.s_id}`)
                .then(result => {
                        dispatch(receiveEditableAnnotationSet());
                    }
                )
                .catch(error => {
                    dispatch(receiveEditableAnnotationSet({}, fetchStatusType.error, error))
                });
        }
    }
}