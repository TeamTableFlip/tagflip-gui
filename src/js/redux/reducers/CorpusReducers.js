import createReducer from './CreateReducer'
import * as types from '../actions/Types'

export const corpora = createReducer([], {
    [types.ACTION_SET_CORPORA](state, action) {
        return action.corpora;
    }
});

export const corpus = createReducer({}, {
    [types.ACTION_SET_CORPUS](state, action) {
        return action.corpus;
    }
});