import createReducer from './CreateReducer'
import * as ServerStatusFetchActions from '../actions/ServerStatusFetchActions'
import { ServerState } from "../types"
import FetchStatusType from '../actions/FetchStatusTypes';

const initialState: ServerState = {
    isFetching: false,
    didInvalidate: false,
    available: true,
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null
}

/**
 * The current connectivity status to the backend.
 * @type {reducer}
 */
export const serverStatus = createReducer(initialState,
    {
        [ServerStatusFetchActions.REQUEST_SERVER_STATUS](draft, action) {
            draft.isFetching = true;
        },
        [ServerStatusFetchActions.INVALIDATE_SERVER_STATUS](draft, action) {
            draft.didInvalidate = true;
        },
        [ServerStatusFetchActions.RECEIVE_SERVER_STATUS](draft, action) {
            draft.isFetching = false;
            draft.didInvalidate = false;
            draft.available = action.available;
            draft.lastUpdated = action.receivedAt;
            draft.status = action.status;
            draft.error = action.error;
        }
    });
