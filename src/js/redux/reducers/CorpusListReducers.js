import createReducer from './CreateReducer'
import * as CorpusFetchActions from '../actions/CorpusListActions'
import fetchStatusType from "../actions/FetchStatusTypes";

/**
 * All currently available corpora of the application.
 * @type {reducer}
 */
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
        },
        [CorpusFetchActions.DELETE_CORPUS](draft, action) {
            draft.items = draft.items.filter(x => x.c_id !== action.corpusId)
        },
    });
