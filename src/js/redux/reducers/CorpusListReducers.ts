import createReducer from './CreateReducer'
import * as CorpusFetchActions from '../actions/CorpusListActions'
import FetchStatusType from "../actions/FetchStatusTypes";
import { CorpusListState } from '../types';

const initialState: CorpusListState = {
    isFetching: false,
    didInvalidate: false,
    items: [],
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null
};

/**
 * All currently available corpora of the application.
 * @type {reducer}
 */
export const corpora = createReducer(initialState,
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
            if (action.status === FetchStatusType.success) {
                draft.items = action.corpora;
                draft.lastUpdated = action.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = FetchStatusType.error;
                draft.error = action.error;
            }
        },
        [CorpusFetchActions.DELETE_CORPUS](draft, action) {
            draft.items = draft.items.filter(x => x.c_id !== action.corpusId)
        },
    });
