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
        [CorpusFetchActions.REQUEST_CORPORA](draft, action) {
            draft.isFetching = true;
        },
        [CorpusFetchActions.INVALIDATE_CORPORA](draft, action) {
            draft.didInvalidate = true;
        },
        [CorpusFetchActions.RECEIVE_CORPORA](draft, action) {
            draft.isFetching = false;
            draft.didInvalidate = false;
            if (action.status === fetchStatusType.success) {
                draft.items = action.corpora;
                draft.lastUpdated = action.receivedAt;
                draft.status = fetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = fetchStatusType.error;
                draft.error = action.error;
            }
        }
    });
