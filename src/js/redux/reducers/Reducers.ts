import { corpora } from './CorpusListReducers';
import { editableCorpus } from './CorpusReducers';
import { serverStatus } from './ServerStatusFetchReducers';
import { annotationSets } from './AnnotationSetListReducers';
import { activeAnnotationSet } from './AnnotationSetReducers';

//import produce from 'immer';
import { combineReducers } from "redux";

// Combine all reducers of the application
const rootReducer = combineReducers({
    corpora: corpora,
    editableCorpus: editableCorpus,
    annotationSets: annotationSets,
    activeAnnotationSet: activeAnnotationSet,
    serverStatus: serverStatus
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;