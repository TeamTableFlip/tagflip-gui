import {combineEpics} from "redux-observable";
import {deleteCorpusEpic, fetchCorporaCountEpic, fetchCorporaEpic} from "./corpus/CorpusListActions";
import {fetchServerStatusEpic} from "./ServerStatusFetchActions";
import {
    deleteAnnotationSetEpic,
    fetchAnnotationSetCountEpic,
    fetchAnnotationSetsEpic
} from "./annotationset/AnnotationSetListActions";
import {
    fetchActiveAnnotationSetEpic,
    saveActiveAnnotationSetEpic,
    setActiveAnnotationSetEpic
} from "./annotationset/AnnotationSetActions";
import {
    fetchActiveCorpusAnnotationSetsEpic,
    fetchActiveCorpusEpic, fetchImportTypesEpic, importAnnotatedCorpusEpic,
    saveCorpusAndUploadDocumentsEpic,
    saveCorpusEpic,
    setActiveCorpusEpic,
    toggleActiveCorpusAnnotationSetEpic,
    fetchExportTypesEpic,
    exportAnnotatedCorpusEpic
} from "./corpus/CorpusActions";
import {
    deleteActiveCorpusDocumentEpic, fetchActiveCorpusDocumentCountEpic,
    fetchActiveCorpusDocumentEpic,
    fetchActiveCorpusDocumentsEpic,
    uploadActiveCorpusDocumentsEpic,
    fetchTagsForActiveDocumentEpic
} from "./corpus/DocumentActions";
import {
    deleteActiveAnnotationSetAnnotationEpic,
    fetchActiveAnnotationSetAnnotationsEpic, saveActiveAnnotationSetAnnotationEpic
} from "./annotationset/AnnotationActions";
import {
    deleteTagEpic,
} from "./corpus/CommonTagActions";
import {
    deleteAnnotationTaskEpic,
    fetchAnnotationTasksEpic,
    generateAnnotationTasksEpic
} from "./annotationtask/AnnotationTaskListActions";
import {fetchAnnotationTasksStatesEpic} from "./annotationtask/AnnotationTaskStateActions";
import {
    fetchActiveAnnotationTaskDocumentCountEpic,
    fetchActiveAnnotationTaskDocuments,
    fetchActiveAnnotationTaskDocumentsEpic,
    fetchActiveAnnotationTaskEpic,
    fetchActiveAnnotationTaskDocumentEpic,
    saveAnnotationTaskDocumentEpic,
    saveAnnotationTaskEpic,
    saveAnnotationTaskWithDocumentsEpic,
    setActiveAnnotationTaskEpic,
    assignDocumentToAnnotationTaskEpic,
    saveTagForActiveAnnotationTaskDocumentEpic,
    fetchTagsForActiveAnnotationTaskDocumentEpic
} from "./annotationtask/AnnotationTaskActions";

const rootEpic = combineEpics(
    setActiveCorpusEpic,
    saveCorpusEpic,
    saveCorpusAndUploadDocumentsEpic,
    fetchActiveCorpusEpic,
    fetchActiveCorpusDocumentEpic,
    fetchActiveCorpusDocumentsEpic,
    fetchActiveCorpusDocumentCountEpic,
    uploadActiveCorpusDocumentsEpic,
    deleteActiveCorpusDocumentEpic,
    fetchCorporaCountEpic,
    fetchCorporaEpic,
    deleteCorpusEpic,
    toggleActiveCorpusAnnotationSetEpic,
    fetchActiveCorpusAnnotationSetsEpic,

    fetchServerStatusEpic,

    fetchAnnotationSetsEpic,
    fetchAnnotationSetCountEpic,
    deleteAnnotationSetEpic,
    setActiveAnnotationSetEpic,
    fetchActiveAnnotationSetEpic,
    saveActiveAnnotationSetEpic,
    fetchActiveAnnotationSetAnnotationsEpic,
    deleteActiveAnnotationSetAnnotationEpic,
    saveActiveAnnotationSetAnnotationEpic,

    fetchTagsForActiveDocumentEpic,
    deleteTagEpic,

    generateAnnotationTasksEpic,
    fetchAnnotationTasksEpic,
    fetchActiveAnnotationTaskEpic,
    setActiveAnnotationTaskEpic,
    saveAnnotationTaskEpic,
    deleteAnnotationTaskEpic,
    saveAnnotationTaskWithDocumentsEpic,
    saveAnnotationTaskDocumentEpic,
    assignDocumentToAnnotationTaskEpic,
    fetchActiveAnnotationTaskDocumentsEpic,
    fetchActiveAnnotationTaskDocumentCountEpic,
    fetchActiveAnnotationTaskDocumentEpic,
    saveTagForActiveAnnotationTaskDocumentEpic,
    fetchTagsForActiveAnnotationTaskDocumentEpic,

    fetchAnnotationTasksStatesEpic,

    fetchImportTypesEpic,
    importAnnotatedCorpusEpic,
    fetchExportTypesEpic,
    exportAnnotatedCorpusEpic
)


export default rootEpic;
