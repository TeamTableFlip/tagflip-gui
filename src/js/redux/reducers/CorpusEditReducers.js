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
        c_id: 0,
        name: "",
        description: ""
    },
    annotationSets: {
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
    documents: []
}, {
    [CorpusEditActions.SET_EDITABLE_CORPUS](draft, action) {
        draft.data = action.corpus;
    },
    [CorpusEditActions.UPDATE_CORPUS_FIELD](draft, action) {
        draft.data[action.field] = action.value;
    },
    [CorpusEditActions.TOGGLE_CORPUS_ANNOTATION_SET](draft, action) {
        if (draft.annotationSets.items.map(a => a.s_id).includes(action.annotationSet.s_id)) { // set is selected
            draft.annotationSets.items = draft.annotationSets.items.filter(a => a.s_id !== action.annotationSet.s_id)        // remove
        }
        else { // set is not selected
            draft.annotationSets.items.push(action.annotationSet); // add
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
    }
});