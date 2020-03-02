import * as corpusFetchReducers from './CorpusListReducers';
import * as corpusEditReducers from './CorpusReducers';
import * as serverStatusFetchReducers from './ServerStatusFetchReducers';
import * as annotationSetFetchReducers from './AnnotationSetListReducers';
import * as annotationSetEditReducers from './AnnotationSetReducers';

//import produce from 'immer';
import {combineReducers} from "redux";

// Combine all reducers of the application
const reducers = combineReducers(Object.assign({},
    corpusFetchReducers, corpusEditReducers, serverStatusFetchReducers, annotationSetFetchReducers,
    annotationSetEditReducers
));

export default reducers;