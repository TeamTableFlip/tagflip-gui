import createReducer from './CreateReducer'
import * as CorpusActions from '../actions/corpus/CorpusActions'
import * as DocumentActions from '../actions/corpus/DocumentActions'
import * as TaggingActions from '../actions/corpus/TaggingActions'
import FetchStatusType from "../actions/FetchStatusTypes";
import Corpus from '../../backend/model/Corpus';
import Document from '../../backend/model/Document';
import {CorpusState} from '../types';
import {BaseAction, PayloadAction, PayloadStatusAction} from "../actions/types";
import AnnotationSet from "../../backend/model/AnnotationSet";
import {QueryParam} from "../../backend/RequestBuilder";
import {FetchCorpusPayload} from "../actions/corpus/DocumentActions";
import Tag from "../../backend/model/Tag";

const initialState: CorpusState = {
    values: Corpus.create(),
    isFetching: false,
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null,
    documents: {
        isFetching: false,
        items: [],
        totalCount: 0,
        lastUpdated: undefined,
        status: FetchStatusType.success,
        error: null
    },
    activeDocument: {
        isFetching: false,
        item: null,
        lastUpdated: undefined,
        status: FetchStatusType.success,
        error: null,
        tags: {
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            status: FetchStatusType.success,
            error: null,
        }
    }
};

//@see https://www.pluralsight.com/guides/deeply-nested-objectives-redux
/**
 * The currently selected Corpus object to be edited.
 * Besides information about the corpus itself, it holds information about its corresponding data, such as the
 * associated AnnotaionSets, Documents, and the currently selected Document with all its Tags.
 * @type {reducer}
 */
export const activeCorpus = createReducer(initialState, {
    [CorpusActions.SET_ACTIVE_CORPUS]: (draft: CorpusState, action: PayloadAction<Corpus>) => {
        draft.values = action.payload;
    },
    [CorpusActions.FETCH_ACTIVE_CORPUS](draft: CorpusState, action: PayloadAction<number>) {
        draft.isFetching = true;
    },
    [CorpusActions.SAVE_CORPUS](draft: CorpusState, action: BaseAction) {
        draft.isFetching = true;
    },
    [CorpusActions.RECEIVE_UPDATE_ACTIVE_CORPUS](draft: CorpusState, action: PayloadStatusAction<Corpus>) {
        draft.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.values = action.payload.data;
            draft.lastUpdated = action.payload.receivedAt;
            draft.status = FetchStatusType.success;
            draft.error = null;
        } else {
            draft.isFetching = false;
            draft.status = FetchStatusType.error;
            draft.error = action.payload.error;
        }
    },
    [DocumentActions.FETCH_ACTIVE_CORPUS_DOCUMENTS](draft: CorpusState, action: PayloadAction<QueryParam[]>) {
        draft.documents.isFetching = true;
    },
    [DocumentActions.RECEIVE_ACTIVE_CORPUS_DOCUMENT_COUNT](draft: CorpusState, action: PayloadStatusAction<number>) {
        draft.documents.totalCount = action.payload.data
    },
    [DocumentActions.RECEIVE_ACTIVE_CORPUS_DOCUMENTS](draft: CorpusState, action: PayloadStatusAction<Document[]>) {
        draft.documents.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.documents.items = action.payload.data;
            draft.documents.lastUpdated = action.payload.receivedAt;
            draft.documents.status = FetchStatusType.success;
            draft.documents.error = null;
        } else {
            draft.documents.isFetching = false;
            draft.documents.status = FetchStatusType.error;
            draft.documents.error = action.payload.error;
        }
    },

    [DocumentActions.REQUEST_CORPUS_IMPORT](draft: CorpusState, action) {
        draft.isFetching = true;
    },
    [DocumentActions.UPLOAD_ACTIVE_CORPUS_DOCUMENTS](draft: CorpusState, action: PayloadAction<File[]>) {
        draft.documents.isFetching = true;
    },
    [DocumentActions.RECEIVE_ACTIVE_CORPUS_UPLOAD_DOCUMENTS](draft: CorpusState, action: PayloadStatusAction<Document[]>) {
        draft.documents.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.documents.lastUpdated = action.payload.receivedAt;
            draft.documents.status = FetchStatusType.success;
            draft.documents.error = null;
        } else {
            draft.documents.isFetching = false;
            draft.documents.status = FetchStatusType.error;
            draft.documents.error = action.payload.error;
        }
    },

    [DocumentActions.RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<number>) {
        draft.documents.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.documents.items = draft.documents.items.filter(x => x.documentId !== action.payload.data)
            draft.documents.lastUpdated = action.payload.receivedAt;
            draft.documents.status = FetchStatusType.success;
            draft.documents.error = null;
        } else {
            draft.documents.isFetching = false;
            draft.documents.status = FetchStatusType.error;
            draft.documents.error = action.payload.error;
        }
    },
    [DocumentActions.FETCH_ACTIVE_CORPUS_DOCUMENT](draft: CorpusState, action : PayloadAction<FetchCorpusPayload>) {
        draft.activeDocument.isFetching = true;
        draft.activeDocument.item = null;
    },
    [DocumentActions.RECEIVE_ACTIVE_CORPUS_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Document>) {
        draft.activeDocument.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.activeDocument.item = action.payload.data;
            draft.activeDocument.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.status = FetchStatusType.success;
            draft.activeDocument.error = null;
        } else {
            draft.activeDocument.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.status = FetchStatusType.error;
            draft.activeDocument.error = action.payload.error;
        }
    },
    [TaggingActions.FETCH_TAGS_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : BaseAction) {
        draft.activeDocument.tags.isFetching = true;
    },
    [TaggingActions.RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Tag[]>) {
        draft.activeDocument.tags.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.activeDocument.tags.items = action.payload.data;
            draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.tags.status = FetchStatusType.success;
            draft.activeDocument.tags.error = null;
        } else {
            draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.tags.status = FetchStatusType.error;
            draft.activeDocument.tags.error = action.payload.error;
        }
    },
    [TaggingActions.SAVE_TAG_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadAction<Tag>) {
        draft.activeDocument.tags.isFetching = true;
    },
    [TaggingActions.RECEIVE_SAVE_TAG_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Tag>) {
        draft.activeDocument.tags.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.activeDocument.tags.items.push(action.payload.data);
            draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.tags.status = FetchStatusType.success;
            draft.activeDocument.tags.error = null;
        } else {
            draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.tags.status = FetchStatusType.error;
            draft.activeDocument.tags.error = action.payload.error;
        }
    },
    [TaggingActions.DELETE_TAG_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadAction<Tag>) {
        draft.activeDocument.tags.isFetching = true;
    },
    [TaggingActions.RECEIVE_DELETE_TAG_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Tag>) {
        draft.activeDocument.tags.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.activeDocument.tags.items = draft.activeDocument.tags.items.filter(x => x.tagId !== action.payload.data.tagId);
            draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.tags.status = FetchStatusType.success;
            draft.activeDocument.tags.error = null;
        } else {
            draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
            draft.activeDocument.tags.status = FetchStatusType.error;
            draft.activeDocument.tags.error = action.payload.error;
        }
    }

});
