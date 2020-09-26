import createReducer from './CreateReducer'
import * as CorpusListActions from '../actions/corpus/CorpusListActions'
import FetchStatusType from "../actions/FetchStatusTypes";
import {CorpusListState, CorpusState} from '../types';
import {BaseAction, PayloadAction, PayloadStatusAction} from "../actions/types";
import Corpus from "../../backend/model/Corpus";
import * as DocumentActions from "../actions/corpus/DocumentActions";
import CorpusList from "../../react/views/corpus/CorpusList";

const initialState: CorpusListState = {
    isFetching: false,
    items: [],
    totalCount: 0,
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
        [CorpusListActions.FETCH_CORPORA](draft: CorpusListState, action : BaseAction) {
            draft.isFetching = true;
        },
        [CorpusListActions.RECEIVE_CORPORA_COUNT](draft: CorpusListState, action: PayloadStatusAction<number>) {
            draft.totalCount = action.payload.data
        },
        [CorpusListActions.RECEIVE_CORPORA](draft: CorpusListState, action : PayloadStatusAction<Corpus[]>) {
            draft.isFetching = false;
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
        [CorpusListActions.RECEIVE_DELETE_CORPUS](draft: CorpusListState, action : PayloadAction<number>) {
            draft.items = draft.items.filter(x => x.corpusId !== action.payload)
        },
    });
