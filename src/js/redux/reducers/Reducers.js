import {combineReducers} from 'redux';
import * as corpusReducers from './CorpusReducers';

// Combine all reducers of the application
const reducers = combineReducers(Object.assign({},
    corpusReducers
));

export default reducers;