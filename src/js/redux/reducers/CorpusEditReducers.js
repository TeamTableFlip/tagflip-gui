import createReducer from './CreateReducer'
import * as CorpusEditActions from '../actions/CorpusEditActions'

export const emptyCorpus = function(state = {}, action) {
    return {
        c_id: 0,
        description: "",
        name: ""
    };
};

export const selectedCorpus = createReducer({}, {
    [CorpusEditActions.SET_SELECTED_CORPUS](state, action) {
        return action.corpus;
    }
});