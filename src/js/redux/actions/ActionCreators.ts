import { fetchCorpora, deleteCorpus } from "./corpus/CorpusListActions";
import {
    setActiveCorpus,
    saveCorpus,
    fetchActiveCorpus
} from './corpus/CorpusActions';
import {
    uploadActiveCorpusDocuments,
    deleteActiveCorpusDocument,
    fetchActiveCorpusDocument,
    fetchActiveCorpusDocuments,
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
    saveAnnotationSet,
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
        saveCorpus,
        fetchActiveCorpus,
        fetchActiveCorpusDocument,
        fetchActiveCorpusDocuments,
        deleteActiveCorpusDocument,
        uploadActiveCorpusDocuments,
        fetchServerStatus,
        fetchAnnotationSets,
        deleteAnnotationSet,
        saveAnnotationSet,
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
