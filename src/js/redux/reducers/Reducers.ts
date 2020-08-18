import { corpora } from './CorpusListReducers';
import { activeCorpus } from './CorpusReducers';
import { serverStatus } from './ServerStatusFetchReducers';
import { annotationSets } from './AnnotationSetListReducers';
import { activeAnnotationSet } from './AnnotationSetReducers';

//import produce from 'immer';
import { combineReducers } from "redux";

// Combine all reducers of the application
const rootReducer = combineReducers({
    corpora,
    activeCorpus,
    annotationSets,
    activeAnnotationSet,
    serverStatus
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
