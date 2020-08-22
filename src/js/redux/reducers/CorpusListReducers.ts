import createReducer from './CreateReducer'
import * as CorpusFetchActions from '../actions/corpus/CorpusListActions'
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
        [CorpusFetchActions.FETCH_CORPORA](draft, action) {
            draft.isFetching = true;
            draft.didInvalidate = true;
        },
        [CorpusFetchActions.RECEIVE_CORPORA](draft, action) {
            draft.isFetching = false;
            draft.didInvalidate = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.items = action.payload.data;
                draft.lastUpdated = action.payload.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = FetchStatusType.error;
                draft.error = action.payload.error;
            }
        },
        [CorpusFetchActions.RECEIVE_DELETE_CORPUS](draft, action) {
            draft.items = draft.items.filter(x => x.corpusId !== action.payload)
        },
    });
