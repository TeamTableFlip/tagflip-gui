import createReducer from './CreateReducer'
import * as CorpusFetchActions from '../actions/CorpusFetchActions'
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyCorpus = function reducer(state = {}, action) {
    return {
        c_id: 0,
        description: "",
        name: ""
    };
};

export const corpora = createReducer({
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
    {
        [CorpusFetchActions.REQUEST_CORPORA](state, action) {
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        },
        [CorpusFetchActions.INVALIDATE_CORPORA](state, action) {
            return Object.assign({}, state, {
                didInvalidate: true
            })
        },
        [CorpusFetchActions.RECEIVE_CORPORA](state, action) {
            if(action.status === fetchStatusType.success) {
                return Object.assign({}, state, {
                    isFetching: false,
                    didInvalidate: false,
                    items: action.corpora,
                    lastUpdated: action.receivedAt,
                    status: fetchStatusType.success,
                    error: null
                })
            } else {
                return Object.assign({}, state, {
                    isFetching: false,
                    didInvalidate: false,
                    status: fetchStatusType.error,
                    error: action.error
                })
            }
        }
    });
