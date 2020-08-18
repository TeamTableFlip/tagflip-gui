import {combineEpics} from "redux-observable";
import {deleteCorpusEpic, fetchCorporaEpic} from "./corpus/CorpusListActions";
import {fetchServerStatusEpic} from "./ServerStatusFetchActions";
import {deleteAnnotationSetEpic, fetchAnnotationSetsEpic} from "./annotationset/AnnotationSetListActions";
import {
    fetchActiveAnnotationSetEpic,
    saveActiveAnnotationSetEpic,
    setActiveAnnotationSetEpic
} from "./annotationset/AnnotationSetActions";
import {
    fetchActiveCorpusAnnotationSetsEpic,
    fetchActiveCorpusEpic,
    saveActiveCorpusEpic,
    setActiveCorpusEpic,
    toggleActiveCorpusAnnotationSetEpic
} from "./corpus/CorpusActions";
import {
    deleteActiveCorpusDocumentEpic,
    fetchActiveCorpusDocumentEpic,
    fetchActiveCorpusDocumentsEpic,
    uploadActiveCorpusDocumentsEpic
} from "./corpus/DocumentActions";
import {
    deleteActiveAnnotationSetAnnotationEpic,
    fetchActiveAnnotationSetAnnotationsEpic, saveActiveAnnotationSetAnnotationEpic
} from "./annotationset/AnnotationActions";
import {
    deleteTagForActiveDocumentEpic,
    fetchTagsForActiveDocumentEpic,
    saveTagForActiveDocumentEpic
} from "./corpus/TaggingActions";

const rootEpic = combineEpics(
    setActiveCorpusEpic,
    saveActiveCorpusEpic,
    fetchActiveCorpusEpic,
    fetchActiveCorpusAnnotationSetsEpic,
    toggleActiveCorpusAnnotationSetEpic,
    fetchActiveCorpusDocumentEpic,
    fetchActiveCorpusDocumentsEpic,
    uploadActiveCorpusDocumentsEpic,
    deleteActiveCorpusDocumentEpic,
    fetchCorporaEpic,
    deleteCorpusEpic,
    fetchServerStatusEpic,

    fetchAnnotationSetsEpic,
    deleteAnnotationSetEpic,
    setActiveAnnotationSetEpic,
    fetchActiveAnnotationSetEpic,
    saveActiveAnnotationSetEpic,
    fetchActiveAnnotationSetAnnotationsEpic,
    deleteActiveAnnotationSetAnnotationEpic,
    saveActiveAnnotationSetAnnotationEpic,

    saveTagForActiveDocumentEpic,
    fetchTagsForActiveDocumentEpic,
    deleteTagForActiveDocumentEpic
)



export default rootEpic;
