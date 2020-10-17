import { fetchCorpora, deleteCorpus } from "./corpus/CorpusListActions";
import {
    setActiveCorpus,
    saveCorpus,
    fetchActiveCorpus,
    saveCorpusAndUploadDocuments,
    toggleActiveCorpusAnnotationSet,
    fetchActiveCorpusAnnotationSets,
    fetchImportTypes,
    fetchExportTypes,
    exportAnnotatedCorpus,
    importAnnotatedCorpus
} from './corpus/CorpusActions';
import {
    uploadActiveCorpusDocuments,
    deleteActiveCorpusDocument,
    fetchActiveCorpusDocument,
    fetchActiveCorpusDocuments,
    fetchTagsForActiveDocument,
} from './corpus/DocumentActions';
import {
    deleteTag
} from './corpus/CommonTagActions';
import { fetchServerStatus } from './ServerStatusFetchActions';
import { fetchAnnotationSets, deleteAnnotationSet } from "./annotationset/AnnotationSetListActions";
import {
    setActiveAnnotationSet,
    saveAnnotationSet,
    fetchActiveAnnotationSet
} from "./annotationset/AnnotationSetActions";
import {
    fetchActiveAnnotationSetAnnotations,
    deleteActiveAnnotationSetAnnotation,
    saveActiveAnnotationSetAnnotation,
    setActiveAnnotationSetEditableAnnotation,
} from "./annotationset/AnnotationActions";

import {
    generateAnnotationTasks,
    fetchAnnotationTasks,
    deleteAnnotationTask
} from "./annotationtask/AnnotationTaskListActions"

import {
    fetchActiveAnnotationTask,
    setActiveAnnotationTask,
    saveAnnotationTask,
    saveAnnotationTaskWithDocuments,
    fetchActiveAnnotationTaskDocuments,
    fetchActiveAnnotationTaskDocument,
    saveAnnotationTaskDocument,
    saveTagForActiveAnnotationTaskDocument,
    fetchTagsForActiveAnnotationTaskDocument
} from "./annotationtask/AnnotationTaskActions"

import {
    fetchAnnotationTaskStates
} from "./annotationtask/AnnotationTaskStateActions"

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        fetchCorpora,
        deleteCorpus,
        setActiveCorpus,
        saveCorpus,
        importAnnotatedCorpus,
        fetchActiveCorpus,

        saveCorpusAndUploadDocuments,
        fetchActiveCorpusDocument,
        fetchActiveCorpusDocuments,
        deleteActiveCorpusDocument,
        uploadActiveCorpusDocuments,

        fetchServerStatus,

        fetchAnnotationSets,
        deleteAnnotationSet,
        saveAnnotationSet,
        fetchActiveAnnotationSet,
        toggleActiveCorpusAnnotationSet,
        fetchActiveCorpusAnnotationSets,
        fetchTagsForActiveDocument,

        fetchActiveAnnotationSetAnnotations,
        saveActiveAnnotationSetAnnotation,
        setActiveAnnotationSetEditableAnnotation,
        deleteActiveAnnotationSetAnnotation,

        deleteTag,
        setActiveAnnotationSet,

        generateAnnotationTasks,
        fetchAnnotationTasks,
        setActiveAnnotationTask,
        fetchActiveAnnotationTask,
        saveAnnotationTask,
        deleteAnnotationTask,
        saveAnnotationTaskWithDocuments,
        fetchActiveAnnotationTaskDocuments,
        fetchActiveAnnotationTaskDocument,
        saveAnnotationTaskDocument,
        saveTagForActiveAnnotationTaskDocument,
        fetchTagsForActiveAnnotationTaskDocument,
        fetchAnnotationTaskStates,
        fetchImportTypes,
        fetchExportTypes,
        exportAnnotatedCorpus
    }
);
