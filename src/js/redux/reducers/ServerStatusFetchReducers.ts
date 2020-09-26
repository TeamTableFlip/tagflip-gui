import createReducer from './CreateReducer'
import * as ServerStatusFetchActions from '../actions/ServerStatusFetchActions'
import { ServerState } from "../types"
import FetchStatusType from '../actions/FetchStatusTypes';
import {BaseAction} from "../actions/types";
import {ServerStatusAction} from "../actions/ServerStatusFetchActions";

const initialState: ServerState = {
    isFetching: false,
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
        [ServerStatusFetchActions.FETCH_SERVER_STATUS](draft: ServerState, action : BaseAction) {
            draft.isFetching = true;
        },
        [ServerStatusFetchActions.RECEIVE_SERVER_STATUS](draft: ServerState, action : ServerStatusAction) {
            draft.isFetching = false;
            draft.available = action.payload.available;
            draft.lastUpdated = action.payload.receivedAt;
            draft.status = action.payload.status;
            draft.error = action.payload.error;
        }
    });
