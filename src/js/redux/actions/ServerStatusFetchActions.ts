import client from '../../backend/RestApi';
import FetchStatusType from "./FetchStatusTypes";


export const REQUEST_SERVER_STATUS = "REQUEST_SERVER_STATUS";

/**
 * Action creator for action REQUEST_SERVER_STATUS
 */
export function requestServerStatus() {
    return {
        type: REQUEST_SERVER_STATUS,
    }
}

export const INVALIDATE_SERVER_STATUS = "INVALIDATE_SERVER_STATUS";

/**
 * Action creator for action INVALIDATE_SERVER_STATUS
 */
export function invalidateServerStatus() {
    return {
        type: INVALIDATE_SERVER_STATUS,
    }
}


export const RECEIVE_SERVER_STATUS = "RECEIVE_SERVER_STATUS";

/**
 * Action creator for action RECEIVE_SERVER_STATUS
 */
export function receiveServerStatus(status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_SERVER_STATUS,
        available: status === FetchStatusType.success,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * Action creator for async fetching current server status.
 * @returns {Function}
 */
export function fetchServerStatus() {
    return (dispatch, getState) => {
        dispatch(requestServerStatus())
        client.httpGet('/test')
            .then(result =>
                dispatch(receiveServerStatus())
            )
            .catch(error => dispatch(receiveServerStatus(FetchStatusType.error, error)))
    }
}
