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
    didInvalidate: false,
    isFetching: false,
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null,
    annotationSets: {
        items: [],
        isFetching: false,
        didInvalidate: false,
        lastUpdated: undefined,
        status: FetchStatusType.success,
        error: null
    },
    documents: {
        isFetching: false,
        didInvalidate: false,
        items: [],
        totalCount: 0,
        lastUpdated: undefined,
        status: FetchStatusType.success,
        error: null
    },
    activeDocument: {
        isFetching: false,
        didInvalidate: true,
        item: null,
        lastUpdated: undefined,
        status: FetchStatusType.success,
        error: null,
        tags: {
            isFetching: false,
            didInvalidate: true,
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
        draft.didInvalidate = true;
        draft.annotationSets.didInvalidate = true;
        draft.documents.didInvalidate = true;
        draft.activeDocument.didInvalidate = true;
        draft.activeDocument.tags.didInvalidate = true;
    },
    [CorpusActions.UPDATE_CORPUS_FIELD]: (draft: CorpusState, action: BaseAction) => {
        draft.values[action.payload.field] = action.payload.value;
    },
    [CorpusActions.ADD_CORPUS_ANNOTATION_SET]: (draft: CorpusState, action: PayloadAction<AnnotationSet>) => {
        draft.annotationSets.items.push(action.payload); // add
    },
    [CorpusActions.REMOVE_CORPUS_ANNOTATION_SET]: (draft: CorpusState, action: PayloadAction<AnnotationSet>) => {
        if (draft.annotationSets.items.map(a => a.annotationSetId).includes(action.payload.annotationSetId)) { // set is selected
            draft.annotationSets.items = draft.annotationSets.items.filter(a => a.annotationSetId !== action.payload.annotationSetId)        // remove
        }
    },
    [CorpusActions.FETCH_ACTIVE_CORPUS_ANNOTATION_SETS](draft: CorpusState, action: BaseAction) {
        draft.annotationSets.isFetching = true;
        draft.annotationSets.didInvalidate = true;
    },
    [CorpusActions.RECEIVE_ACTIVE_CORPUS_ANNOTATION_SETS](draft: CorpusState, action: PayloadStatusAction<AnnotationSet[]>) {
        draft.annotationSets.isFetching = false;
        draft.annotationSets.didInvalidate = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.annotationSets.items = action.payload.data;
            draft.annotationSets.lastUpdated = action.payload.receivedAt;
            draft.annotationSets.status = FetchStatusType.success;
            draft.annotationSets.error = null;
        } else {
            draft.annotationSets.isFetching = false;
            draft.annotationSets.didInvalidate = false;
            draft.annotationSets.status = FetchStatusType.error;
            draft.annotationSets.error = action.payload.error;
        }
    },
    [CorpusActions.FETCH_ACTIVE_CORPUS](draft: CorpusState, action: PayloadAction<number>) {
        draft.isFetching = true;
        draft.didInvalidate = true;
    },
    [CorpusActions.SAVE_ACTIVE_CORPUS](draft: CorpusState, action: BaseAction) {
        draft.isFetching = true;
        draft.didInvalidate = true;
    },
    [CorpusActions.RECEIVE_UPDATE_ACTIVE_CORPUS](draft: CorpusState, action: PayloadStatusAction<Corpus>) {
        draft.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.values = action.payload.data;
            draft.lastUpdated = action.payload.receivedAt;
            draft.status = FetchStatusType.success;
            draft.error = null;
            draft.didInvalidate = false;
        } else {
            draft.isFetching = false;
            draft.status = FetchStatusType.error;
            draft.error = action.payload.error;
        }
    },
    [DocumentActions.FETCH_ACTIVE_CORPUS_DOCUMENTS](draft: CorpusState, action: PayloadAction<QueryParam[]>) {
        draft.documents.isFetching = true;
        draft.documents.didInvalidate = true;
    },
    [DocumentActions.RECEIVE_ACTIVE_CORPUS_DOCUMENT_COUNT](draft: CorpusState, action: PayloadStatusAction<number>) {
        draft.documents.totalCount = action.payload.data
    },
    [DocumentActions.RECEIVE_ACTIVE_CORPUS_DOCUMENTS](draft: CorpusState, action: PayloadStatusAction<Document[]>) {
        draft.documents.isFetching = false;
        draft.documents.didInvalidate = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.documents.items = action.payload.data;
            draft.documents.lastUpdated = action.payload.receivedAt;
            draft.documents.status = FetchStatusType.success;
            draft.documents.error = null;
        } else {
            draft.documents.isFetching = false;
            draft.documents.didInvalidate = false;
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
        draft.documents.didInvalidate = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.documents.lastUpdated = action.payload.receivedAt;
            draft.documents.status = FetchStatusType.success;
            draft.documents.error = null;
        } else {
            draft.documents.isFetching = false;
            draft.documents.didInvalidate = false;
            draft.documents.status = FetchStatusType.error;
            draft.documents.error = action.payload.error;
        }
    },

    [DocumentActions.RECEIVE_DELETE_ACTIVE_CORPUS_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<number>) {
        draft.documents.isFetching = false;
        draft.documents.didInvalidate = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.documents.items = draft.documents.items.filter(x => x.documentId !== action.payload.data)
            draft.documents.lastUpdated = action.payload.receivedAt;
            draft.documents.status = FetchStatusType.success;
            draft.documents.error = null;
        } else {
            draft.documents.isFetching = false;
            draft.documents.didInvalidate = false;
            draft.documents.status = FetchStatusType.error;
            draft.documents.error = action.payload.error;
        }
    },
    [DocumentActions.FETCH_ACTIVE_CORPUS_DOCUMENT](draft: CorpusState, action : PayloadAction<FetchCorpusPayload>) {
        draft.activeDocument.isFetching = true;
        draft.activeDocument.didInvalidate = true;
        draft.activeDocument.item = null;
    },
    [DocumentActions.RECEIVE_ACTIVE_CORPUS_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Document>) {
        draft.activeDocument.isFetching = false;
        draft.activeDocument.didInvalidate = false;
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
        draft.activeDocument.tags.didInvalidate = true;
    },
    [TaggingActions.RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Tag[]>) {
        draft.activeDocument.tags.isFetching = false;
        draft.activeDocument.tags.didInvalidate = false;
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
        draft.activeDocument.tags.didInvalidate = true;
    },
    [TaggingActions.RECEIVE_SAVE_TAG_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Tag>) {
        draft.activeDocument.tags.isFetching = false;
        draft.activeDocument.tags.didInvalidate = false;
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
        draft.activeDocument.tags.didInvalidate = true;
    },
    [TaggingActions.RECEIVE_DELETE_TAG_FOR_ACTIVE_DOCUMENT](draft: CorpusState, action : PayloadStatusAction<Tag>) {
        draft.activeDocument.tags.isFetching = false;
        draft.activeDocument.tags.didInvalidate = false;
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
