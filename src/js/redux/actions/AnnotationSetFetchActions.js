import client from '../../backend/RestApi';

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
export function receiveAnnotationSets(annotationSets) {
    return {
        type: RECEIVE_ANNOTATION_SETS,
        annotationSets: annotationSets,
        receivedAt: Date.now()
    }
}


/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function fetchAnnotationSets() {
    return (dispatch, getState) => {
        dispatch(requestCorpora())
        client.httpGet('/annotationset')
            .then(
                result => result,
                error => console.log('An error occurred.', error))
            .then(result =>
                dispatch(receiveAnnotationSets(result))
            )
    }
}
