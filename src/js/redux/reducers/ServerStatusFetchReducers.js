import createReducer from './CreateReducer'
import * as ServerStatusFetchActions from '../actions/ServerStatusFetchActions'
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyCorpus = function reducer(draft = {}, action) {
    return {
        c_id: 0,
        description: "",
        name: ""
    };
};

export const serverStatus = createReducer({
        isFetching: false,
        didInvalidate: false,
        available: true,
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
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
