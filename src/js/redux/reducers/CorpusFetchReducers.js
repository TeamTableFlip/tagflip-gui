import createReducer from './CreateReducer'
import * as CorpusFetchActions from '../actions/CorpusFetchActions'
import fetchStatusType from "../actions/FetchStatusTypes";

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
                // didInvalidate: false  // tnte: commented this out though it is used by redux reference. a request does not validate data... valid data is available after response/receive
            })
        },
        [CorpusFetchActions.INVALIDATE_CORPORA](state, action) {
            return Object.assign({}, state, {
                didInvalidate: true
            })
        },
        [CorpusFetchActions.RECEIVE_CORPORA](state, action) {
            if (action.status === fetchStatusType.success) {
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
