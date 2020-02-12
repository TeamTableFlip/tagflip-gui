import createReducer from './CreateReducer'
import * as ServerStatusFetchActions from '../actions/ServerStatusFetchActions'
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyCorpus = function reducer(state = {}, action) {
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
        [ServerStatusFetchActions.REQUEST_SERVER_STATUS](state, action) {
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        },
        [ServerStatusFetchActions.INVALIDATE_SERVER_STATUS](state, action) {
            return Object.assign({}, state, {
                didInvalidate: true
            })
        },
        [ServerStatusFetchActions.RECEIVE_SERVER_STATUS](state, action) {
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                available: action.available,
                lastUpdated: action.receivedAt,
                status: action.status,
                error: action.error
            })
        }
    });
