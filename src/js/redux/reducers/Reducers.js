import * as corpusFetchReducers from './CorpusFetchReducers';
import * as corpusEditReducers from './CorpusEditReducers';
import * as serverStatusFetchReducers from './ServerStatusFetchReducers';
import * as annotationSetFetchReducers from './AnnotationSetFetchReducers';
import * as annotationSetEditReducers from './AnnotationSetEditReducers';
import * as annotationFetchReducers from './AnnotationFetchReducers';

//import produce from 'immer';
import {combineReducers} from "redux";

// Combine all reducers of the application
const reducers = combineReducers(Object.assign({},
    corpusFetchReducers, corpusEditReducers, serverStatusFetchReducers, annotationSetFetchReducers,
    annotationSetEditReducers, annotationFetchReducers
));

export default reducers;