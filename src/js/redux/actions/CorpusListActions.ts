import client from '../../backend/RestApi';
import FetchStatusType from "./FetchStatusTypes";


export const REQUEST_CORPORA = "REQUEST_CORPORA";

/**
 * Action creator for action REQUEST_CORPORA
 * @returns {{type: *}}
 */
export function requestCorpora() {
    return {
        type: REQUEST_CORPORA,
    }
}


export const INVALIDATE_CORPORA = "INVALIDATE_CORPORA";

/**
 * Action creator for action INVALIDATE_CORPORA
 * @returns {{type: *}}
 */
export function invalidateCorpora() {
    return {
        type: INVALIDATE_CORPORA,
    }
}


export const RECEIVE_CORPORA = "RECEIVE_CORPORA";

/**
 * Action creator for action RECEIVE_CORPORA
 * @param corpora the corpora
 * @param status response status
 * @param error response error
 * @returns {{corpora: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveCorpora(corpora, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPORA,
        corpora: corpora,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * Action creator for async fetching all corpora.
 * @returns {Function}
 */
export function fetchCorpora() {
    return (dispatch, getState) => {
        dispatch(requestCorpora())
        client.httpGet('/corpus')
            .then(result =>
                dispatch(receiveCorpora(result))
            )
            .catch(error => dispatch(receiveCorpora([], FetchStatusType.error, error)))
    }
}

export const DELETE_CORPUS = "DELETE_CORPUS";

/**
 * Action creator for async delete of given corpus
 * @param corpusId the id of the deletable corpus.
 * @returns {Function}
 */
export function deleteCorpus(corpusId: number) {
    return (dispatch, getState) => {
        client.httpDelete(`/corpus/${corpusId}`, {})
            .then(result => {
                dispatch({
                    type: DELETE_CORPUS,
                    corpusId
                });
            }
            )
            .catch(error => dispatch(receiveCorpora([], FetchStatusType.error, error)))
    }
}



