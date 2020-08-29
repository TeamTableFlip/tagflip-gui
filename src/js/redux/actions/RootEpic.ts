import {combineEpics} from "redux-observable";
import {deleteCorpusEpic, fetchCorporaCountEpic, fetchCorporaEpic} from "./corpus/CorpusListActions";
import {fetchServerStatusEpic} from "./ServerStatusFetchActions";
import {deleteAnnotationSetEpic, fetchAnnotationSetsEpic} from "./annotationset/AnnotationSetListActions";
import {
    fetchActiveAnnotationSetEpic,
    saveActiveAnnotationSetEpic,
    setActiveAnnotationSetEpic
} from "./annotationset/AnnotationSetActions";
import {
    fetchActiveCorpusEpic,
    saveCorpusEpic,
    setActiveCorpusEpic,
} from "./corpus/CorpusActions";
import {
    deleteActiveCorpusDocumentEpic, fetchActiveCorpusDocumentCountEpic,
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
    saveCorpusEpic,
    fetchActiveCorpusEpic,
    fetchActiveCorpusDocumentEpic,
    fetchActiveCorpusDocumentsEpic,
    fetchActiveCorpusDocumentCountEpic,
    uploadActiveCorpusDocumentsEpic,
    deleteActiveCorpusDocumentEpic,
    fetchCorporaCountEpic,
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
