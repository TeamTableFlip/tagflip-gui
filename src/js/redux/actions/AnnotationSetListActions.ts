import client from '../../backend/RestApi';
import FetchStatusType from "./FetchStatusTypes";

export const REQUEST_ANNOTATION_SETS = "REQUEST_ANNOTATION_SETS";

/**
 * Action creator for action REQUEST_ANNOTATION_SETS.
 * @returns {{type: *}}
 */
export function requestAnnotationSets() {
    return {
        type: REQUEST_ANNOTATION_SETS,
    }
}

export const INVALIDATE_ANNOTATION_SETS = "INVALIDATE_ANNOTATION_SETS";

/**
 * Action creator for action INVALIDATE_ANNOTATION_SETS.
 * @returns {{type: *}}
 */
export function invalidateAnnotationSets() {
    return {
        type: INVALIDATE_ANNOTATION_SETS,
    }
}


export const RECEIVE_ANNOTATION_SETS = "RECEIVE_ANNOTATION_SETS";

/**
 * Action creator for action RECEIVE_ANNOTATION_SETS.
 * @param annotationSets the AnnotationSets
 * @param status response status
 * @param error response error
 * @returns {{annotationSets: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveAnnotationSets(annotationSets, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_ANNOTATION_SETS,
        annotationSets: annotationSets,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Action creator for async fetching all AnnotationSets.
 * @return {Function}
 */
export function fetchAnnotationSets() {
    return (dispatch, getState) => {
        dispatch(requestAnnotationSets());
        client.httpGet('/annotationset')
            .then(result =>
                dispatch(receiveAnnotationSets(result))
            )
            .catch(error =>
                dispatch(receiveAnnotationSets([], FetchStatusType.error, error))
            );
    }
}

// Actions for deleting Annotation Sets


export const DELETE_ANNOTATION_SET = "DELETE_ANNOTATION_SET";

/**
 * Action creator for async delete given AnnotationSet.
 * @param annotationSetId id of the AnnotationSet that should be deleted
 * @return {Function}
 */
export function deleteAnnotationSet(annotationSetId) {
    return (dispatch, getState) => {
        client.httpDelete(`/annotationset/${annotationSetId}`)
            .then(result => {
                return dispatch({
                    type: DELETE_ANNOTATION_SET,
                    annotationSetId
                });
            })
            .catch(err => {
                dispatch(receiveAnnotationSets([], FetchStatusType.error, err))
            });
    }
}