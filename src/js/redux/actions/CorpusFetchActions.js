import client from '../../backend/RestApi';
import fetchStatusType from "./FetchStatusTypes";

export const REQUEST_CORPORA = "REQUEST_CORPORA";

export function requestCorpora() {
    return {
        type: REQUEST_CORPORA,
    }
}

export const INVALIDATE_CORPORA = "INVALIDATE_CORPORA";

export function invalidateCorpora() {
    return {
        type: INVALIDATE_CORPORA,
    }
}

export const RECEIVE_CORPORA = "RECEIVE_CORPORA";

export function receiveCorpora(corpora, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPORA,
        corpora: corpora,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function fetchCorpora() {
    return (dispatch, getState) => {
        dispatch(requestCorpora())
        client.httpGet('/corpus')
            .then(result =>
                dispatch(receiveCorpora(result))
            )
            .catch(error => dispatch(receiveCorpora([], fetchStatusType.error, error)))
    }
}
