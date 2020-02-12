import {combineReducers} from 'redux';
import * as corpusFetchReducers from './CorpusFetchReducers';
import * as corpusEditReducers from './CorpusEditReducers';
import * as serverStatusFetchReducers from './ServerStatusFetchReducers';

// Combine all reducers of the application
const reducers = combineReducers(Object.assign({},
    corpusFetchReducers, corpusEditReducers, serverStatusFetchReducers
));

export default reducers;