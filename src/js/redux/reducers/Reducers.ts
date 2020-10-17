import { corpora } from './CorpusListReducers';
import { activeCorpus } from './CorpusReducers';
import { corpusImporters } from './CorpusImporterReducers';
import { corpusExporters } from './CorpusExporterReducers';
import { serverStatus } from './ServerStatusFetchReducers';
import { annotationSets } from './AnnotationSetListReducers';
import { activeAnnotationSet } from './AnnotationSetReducers';
import { annotationTasks } from './AnnotationTaskListReducers';
import { annotationTaskStates } from './AnnotationTaskStateReducers';
import { activeAnnotationTask } from './AnnotationTaskReducers';


//import produce from 'immer';
import { combineReducers } from "redux";

// Combine all reducers of the application
const rootReducer = combineReducers({
    corpora,
    activeCorpus,
    corpusImporters,
    corpusExporters,
    annotationSets,
    activeAnnotationSet,
    serverStatus,
    annotationTasks,
    annotationTaskStates,
    activeAnnotationTask
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
