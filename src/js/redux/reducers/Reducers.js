import * as corpusFetchReducers from './CorpusFetchReducers';
import * as corpusEditReducers from './CorpusEditReducers';
import * as serverStatusFetchReducers from './ServerStatusFetchReducers';
import * as annotationSetFetchReducers from './AnnotationSetFetchReducers';
import * as annotationSetEditReducers from './AnnotationSetEditReducers';

import produce from 'immer';
import {combineReducers} from "redux-immer";

// Combine all reducers of the application
const reducers = combineReducers(produce, Object.assign({},
    corpusFetchReducers, corpusEditReducers, serverStatusFetchReducers, annotationSetFetchReducers,
    annotationSetEditReducers
));

export default reducers;