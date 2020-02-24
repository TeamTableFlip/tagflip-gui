import createReducer from './CreateReducer'
import * as CorpusEditActions from '../actions/CorpusEditActions'
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyCorpus = function (state = {}, action) {
    return {
        c_id: 0,
        description: "",
        name: ""
    };
};

//@see https://www.pluralsight.com/guides/deeply-nested-objectives-redux
export const editableCorpus = createReducer({
    data: {
        values: {
            c_id: 0,
            name: "",
            description: "",
        },
        isFetching: false,
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null,
    },
    annotationSets: {
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
    documents: {
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
}, {
    [CorpusEditActions.SET_EDITABLE_CORPUS](draft, action) {
        draft.data.values = action.corpus;
    },
    [CorpusEditActions.UPDATE_CORPUS_FIELD](draft, action) {
        draft.data.values[action.field] = action.value;
    },
    [CorpusEditActions.ADD_CORPUS_ANNOTATION_SET](draft, action) {
        draft.annotationSets.items.push(action.annotationSet); // add
    },
    [CorpusEditActions.REMOVE_CORPUS_ANNOTATION_SET](draft, action) {
        if (draft.annotationSets.items.map(a => a.s_id).includes(action.annotationSet.s_id)) { // set is selected
            draft.annotationSets.items = draft.annotationSets.items.filter(a => a.s_id !== action.annotationSet.s_id)        // remove
        }
    },
    [CorpusEditActions.REQUEST_CORPUS_ANNOTATION_SETS](draft, action) {
        draft.annotationSets.isFetching = true;
    },
    [CorpusEditActions.INVALIDATE_CORPUS_ANNOTATION_SETS](draft, action) {
        draft.annotationSets.didInvalidate = true;
    },
    [CorpusEditActions.RECEIVE_CORPUS_ANNOTATION_SETS](draft, action) {
        draft.annotationSets.isFetching = false;
        draft.annotationSets.didInvalidate = false;
        if (action.status === fetchStatusType.success) {
            draft.annotationSets.items = action.annotationSets;
            draft.annotationSets.lastUpdated = action.receivedAt;
            draft.annotationSets.status = fetchStatusType.success;
            draft.annotationSets.error = null;
        } else {
            draft.annotationSets.isFetching = false;
            draft.annotationSets.didInvalidate = false;
            draft.annotationSets.status = fetchStatusType.error;
            draft.annotationSets.error = action.error;
        }
    },

    [CorpusEditActions.REQUEST_UPDATE_CORPUS](draft, action) {
        draft.data.isFetching = true;
    },
    [CorpusEditActions.RECEIVE_UPDATE_CORPUS](draft, action) {
        draft.data.isFetching = false;
        if (action.status === fetchStatusType.success) {
            draft.data.values = action.corpus;
            draft.data.lastUpdated = action.receivedAt;
            draft.data.status = fetchStatusType.success;
            draft.data.error = null;
        } else {
            draft.data.isFetching = false;
            draft.data.status = fetchStatusType.error;
            draft.data.error = action.error;
        }
    },

    [CorpusEditActions.REQUEST_CORPUS_DOCUMENTS](draft, action) {
        draft.documents.isFetching = true;
    },
    [CorpusEditActions.INVALIDATE_CORPUS_DOCUMENTS](draft, action) {
        draft.documents.didInvalidate = true;
    },
    [CorpusEditActions.RECEIVE_CORPUS_DOCUMENTS](draft, action) {
        draft.documents.isFetching = false;
        draft.documents.didInvalidate = false;
        if (action.status === fetchStatusType.success) {
            draft.documents.items = action.documents;
            draft.documents.lastUpdated = action.receivedAt;
            draft.documents.status = fetchStatusType.success;
            draft.documents.error = null;
        } else {
            draft.documents.isFetching = false;
            draft.documents.didInvalidate = false;
            draft.documents.status = fetchStatusType.error;
            draft.documents.error = action.error;
        }
    },
});