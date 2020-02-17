import client from '../../backend/RestApi';
import fetchStatusType from "./FetchStatusTypes";

export const REQUEST_ANNOTATIONS = "REQUEST_ANNOTATIONS";
export function requestAnnotations() {
    return {
        type: REQUEST_ANNOTATIONS,
    }
}

export const INVALIDATE_ANNOTATIONS = "INVALIDATE_ANNOTATIONS";
export function invalidateAnnotations() {
    return {
        type: INVALIDATE_ANNOTATIONS,
    }
}

export const RECEIVE_ANNOTATIONS = "RECEIVE_ANNOTATIONS";
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
 * Fetch all Annotations from the REST API.
 * @returns {Function}
 */
export function fetchAnnotations(annotationSetId = undefined) {
    return (dispatch, getState) => {
        dispatch(requestAnnotations());

        let url = /annotation/;
        if(annotationSetId) {
            url += annotationSetId;
        }

        client.httpGet(url)
            .then(result =>
                dispatch(receiveAnnotations(result))
            )
            .catch(error =>
                dispatch(receiveAnnotations([], fetchStatusType.error, error))
            );
    }
}