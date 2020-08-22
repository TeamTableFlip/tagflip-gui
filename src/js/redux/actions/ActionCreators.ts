import { fetchCorpora, deleteCorpus } from "./corpus/CorpusListActions";
import {
    setActiveCorpus,
    updateCorpusField,
    toggleActiveCorpusAnnotationSet,
    saveActiveCorpus,
    fetchActiveCorpus
} from './corpus/CorpusActions';
import {
    uploadActiveCorpusDocuments,
    deleteActiveCorpusDocument,
    fetchActiveCorpusDocument,
    uploadCorpus
} from './corpus/DocumentActions';
import {
    saveTagForActiveDocument,
    deleteTagForActiveDocument,
} from './corpus/TaggingActions';
import { fetchServerStatus } from './ServerStatusFetchActions';
import { fetchAnnotationSets, deleteAnnotationSet } from "./annotationset/AnnotationSetListActions";
import {
    setActiveAnnotationSet,
    saveActiveAnnotationSet,
    updateActiveAnnotationSetField,
    fetchActiveAnnotationSet
} from "./annotationset/AnnotationSetActions";
import {
    fetchActiveAnnotationSetAnnotations,
    deleteActiveAnnotationSetAnnotation,
    updateActiveAnnotationSetEditableAnnotationField,
    saveActiveAnnotationSetAnnotation,
    setActiveAnnotationSetEditableAnnotation,
} from "./annotationset/AnnotationActions";

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        fetchCorpora,
        deleteCorpus,
        setActiveCorpus,
        updateCorpusField,
        toggleActiveCorpusAnnotationSet,
        saveActiveCorpus,
        fetchActiveCorpus,
        fetchActiveCorpusDocument,
        deleteActiveCorpusDocument,
        uploadActiveCorpusDocuments,
        fetchServerStatus,
        fetchAnnotationSets,
        deleteAnnotationSet,
        saveActiveAnnotationSet,
        updateActiveAnnotationSetField,
        fetchActiveAnnotationSet,
        fetchActiveAnnotationSetAnnotations,
        saveActiveAnnotationSetAnnotation,
        updateActiveAnnotationSetEditableAnnotationField,
        setActiveAnnotationSetEditableAnnotation,
        deleteActiveAnnotationSetAnnotation,
        saveTagForActiveDocument,
        deleteTagForActiveDocument,
        setActiveAnnotationSet,
        uploadCorpus
    }
);
