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
    [CorpusEditActions.SET_EDITABLE_CORPUS](state, action) {
        state.data = action.corpus;
        return state;
    },
    [CorpusEditActions.UPDATE_CORPUS_FIELD](state, action) {
        state.data.name = action.value;
        return state;
    },
    [CorpusEditActions.TOGGLE_CORPUS_ANNOTATION_SET](state, action) {
        if (state.annotationSets.map(a => a.s_id).includes(action.annotationSet.s_id)) {
            state.annotationSets.items = state.annotationSets.items.filter(a => a.s_id !== action.annotationSet.s_id)       // set is selected
        }
        state.annotationSets.items.push(action.annotationSet); // set is not selected
        return state;
    },
    [CorpusEditActions.REQUEST_CORPUS_ANNOTATION_SETS](state, action) {
        state.annotationSets.isFetching = true;
        return state;
    },
    [CorpusEditActions.INVALIDATE_CORPUS_ANNOTATION_SETS](state, action) {
        state.annotationSets.didInvalidate = true;
        return state;
    },
    [CorpusEditActions.RECEIVE_CORPUS_ANNOTATION_SETS](state, action) {
        state.annotationSets.isFetching = false;
        state.annotationSets.didInvalidate = false;
        if (action.status === fetchStatusType.success) {
            state.annotationSets.items = action.annotationSets;
            state.annotationSets.lastUpdated = action.receivedAt;
            state.annotationSets.status = fetchStatusType.success;
            state.annotationSets.error = null;
        } else {
            state.annotationSets.isFetching = false;
            state.annotationSets.didInvalidate = false;
            state.annotationSets.status = fetchStatusType.error;
            state.annotationSets.error = action.error;
        }
        return state;
    }
});