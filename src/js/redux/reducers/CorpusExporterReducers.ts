import createReducer from './CreateReducer'
import * as CorpusActions from '../actions/corpus/CorpusActions'
import FetchStatusType from "../actions/FetchStatusTypes";
import {CorpusExportersState} from '../types';
import {PayloadStatusAction} from "../actions/types";

const initialState: CorpusExportersState = {
    items: [],
    isFetching: false,
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null
};

//@see https://www.pluralsight.com/guides/deeply-nested-objectives-redux
/**
 * The currently selected Corpus object to be edited.
 * Besides information about the corpus itself, it holds information about its corresponding data, such as the
 * associated AnnotaionSets, Documents, and the currently selected Document with all its Tags.
 * @type {reducer}
 */
export const corpusExporters = createReducer(initialState, {

    [CorpusActions.FETCH_EXPORT_TYPES](draft: CorpusExportersState, action) {
        draft.isFetching = true;
    },
    [CorpusActions.RECEIVE_EXPORT_TYPES](draft: CorpusExportersState, action: PayloadStatusAction<string[]>) {
        draft.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.items = action.payload.data;
            draft.lastUpdated = action.payload.receivedAt;
            draft.status = FetchStatusType.success;
            draft.error = null;
        } else {
            draft.isFetching = false;
            draft.status = FetchStatusType.error;
            draft.error = action.payload.error;
        }
    },

});
