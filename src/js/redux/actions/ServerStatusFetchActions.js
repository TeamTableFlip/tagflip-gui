import client from '../../backend/RestApi';
import fetchStatusType from "./FetchStatusTypes";

export const REQUEST_SERVER_STATUS = "REQUEST_SERVER_STATUS";

export function requestServerStatus() {
    return {
        type: REQUEST_SERVER_STATUS,
    }
}

export const INVALIDATE_SERVER_STATUS = "INVALIDATE_SERVER_STATUS";

export function invalidateServerStatus() {
    return {
        type: INVALIDATE_SERVER_STATUS,
    }
}

export const RECEIVE_SERVER_STATUS = "RECEIVE_SERVER_STATUS";

export function receiveServerStatus(status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_SERVER_STATUS,
        available: status === fetchStatusType.success,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function fetchServerStatus() {
    return (dispatch, getState) => {
        dispatch(requestServerStatus())
        client.httpGet('/test/test')
            .then(result =>
                dispatch(receiveServerStatus())
            )
            .catch(error => dispatch(receiveServerStatus(fetchStatusType.error, error)))
    }
}
