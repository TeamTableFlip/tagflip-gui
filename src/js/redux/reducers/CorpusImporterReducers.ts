import createReducer from './CreateReducer'
import * as CorpusActions from '../actions/corpus/CorpusActions'
import * as DocumentActions from '../actions/corpus/DocumentActions'
import * as CommonTagActions from '../actions/corpus/CommonTagActions'
import FetchStatusType from "../actions/FetchStatusTypes";
import Corpus from '../../backend/model/Corpus';
import Document from '../../backend/model/Document';
import {CorpusImportersState, CorpusState} from '../types';
import {BaseAction, PayloadAction, PayloadStatusAction} from "../actions/types";
import AnnotationSet from "../../backend/model/AnnotationSet";
import {QueryParam} from "../../backend/RequestBuilder";
import {FetchCorpusPayload} from "../actions/corpus/DocumentActions";
import Tag from "../../backend/model/Tag";

const initialState: CorpusImportersState = {
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
export const corpusImporters = createReducer(initialState, {

    [CorpusActions.FETCH_IMPORT_TYPES](draft: CorpusImportersState, action) {
        draft.isFetching = true;
    },
    [CorpusActions.RECEIVE_IMPORT_TYPES](draft: CorpusImportersState, action: PayloadStatusAction<string[]>) {
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
