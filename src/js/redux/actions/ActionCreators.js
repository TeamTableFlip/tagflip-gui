import {fetchCorpora, deleteCorpus} from "./CorpusListActions";
import {
    setEditableCorpus,
    fetchCorpusAnnotationSets,
    updateCorpusField,
    toggleCorpusAnnotationSet,
    saveCorpus,
    reloadCorpus,
} from './CorpusEditActions';
import {fetchServerStatus} from './ServerStatusFetchActions';
import {fetchAnnotationSets, deleteAnnotationSet} from "./AnnotationSetListActions";
import {
    setEditableAnnotationSet,
    saveAnnotationSet,
    updateAnnotationSetField,
    reloadAnnotationSet,
    fetchAnnotations
} from "./AnnotationSetEditActions";
import {
    updateAnnotationField,
    saveAnnotation,
    setEditableAnnotation,
    deleteAnnotation
} from "./AnnotationEditActions";

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        fetchCorpora,
        deleteCorpus,
        setEditableCorpus,
        updateCorpusField,
        toggleCorpusAnnotationSet,
        fetchCorpusAnnotationSets,
        saveCorpus,
        reloadCorpus,
        fetchServerStatus,
        fetchAnnotationSets,
        deleteAnnotationSet,
        setEditableAnnotationSet,
        saveAnnotationSet,
        updateAnnotationSetField,
        reloadAnnotationSet,
        fetchAnnotations,
        saveAnnotation,
        updateAnnotationField,
        setEditableAnnotation,
        deleteAnnotation
    }
);