import createReducer from './CreateReducer'
import * as types from '../actions/Types'

export const emptyCorpus =  function reducer(state = {}, action)
{
    return {
        c_id: 0,
        description: "",
        name: ""
    };
}

export const corpora = createReducer([], {
    [types.ACTION_SET_CORPORA](state, action) {
        return action.corpora;
    }
});

export const activeEditCorpus = createReducer({}, {
    [types.ACTION_SET_ACTIVE_EDIT_CORPUS](state, action) {
        return action.corpus;
    }
});