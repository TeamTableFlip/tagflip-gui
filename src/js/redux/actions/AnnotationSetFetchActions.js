import client from '../../backend/RestApi';
import fetchStatusType from "./FetchStatusTypes";

export const REQUEST_ANNOTATION_SETS = "REQUEST_ANNOTATION_SETS";
export function requestAnnotationSets() {
    return {
        type: REQUEST_ANNOTATION_SETS,
    }
}

export const INVALIDATE_ANNOTATION_SETS = "INVALIDATE_ANNOTATION_SETS";
export function invalidateAnnotationSets() {
    return {
        type: INVALIDATE_ANNOTATION_SETS,
    }
}

export const RECEIVE_ANNOTATION_SETS = "RECEIVE_ANNOTATION_SETS";
export function receiveAnnotationSets(annotationSets, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_ANNOTATION_SETS,
        annotationSets: annotationSets,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function fetchAnnotationSets() {
    return (dispatch, getState) => {
        dispatch(requestAnnotationSets());
        client.httpGet('/annotationset')
            .then(result =>
                dispatch(receiveAnnotationSets(result))
            )
            .catch(error =>
                dispatch(receiveAnnotationSets([], fetchStatusType.error, error))
            );
    }
}

export const REQUEST_SAVE_ANNOTATION_SET = "REQUEST_SAVE_ANNOTATION_SET";
export function requestSaveAnnotationSet() {
    return {
        type: REQUEST_SAVE_ANNOTATION_SET
    }
}

export const RECEIVE_SAVE_ANNOTATION_SET = "RECEIVE_SAVE_ANNOTATION_SET";
export function receiveSaveAnnotationSet(annotationSet, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_SAVE_ANNOTATION_SET,
        annotationSet: annotationSet,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export function saveAnnotationSet(annotationSet) {
    return (dispatch, getState) => {
        dispatch(requestSaveAnnotationSet());

        // Decide whether to PUT for update or POST for create
        // FIXME: Backend responds with 400, Bad request
        if(!annotationSet.s_id || annotationSet.s_id <= 0) {
            client.httpPost('/annotationset', annotationSet)
            .then(result =>
                dispatch(receiveSaveAnnotationSet(result))
            )
            .catch(err =>
                dispatch(receiveSaveAnnotationSet({}, fetchStatusType.error, err))
            );
        }
        else {
            client.httpPut(`/annotationset/${annotationSet.s_id}`, annotationSet)
            .then(result =>
                dispatch(receiveSaveAnnotationSet(result))
            )
            .catch(err =>
                dispatch(receiveSaveAnnotationSet({}, fetchStatusType.error, err))
            );
        }
    }
}