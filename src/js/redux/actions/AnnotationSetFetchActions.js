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