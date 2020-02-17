import {fetchCorpora} from "./CorpusFetchActions";
import {
    setEditableCorpus,
    fetchCorpusAnnotationSets,
    updateCorpusField,
    toggleCorpusAnnotationSet,
    saveCorpus,
    reloadCorpus
} from './CorpusEditActions';
import {fetchServerStatus} from './ServerStatusFetchActions';
import {fetchAnnotationSets} from "./AnnotationSetFetchActions";
import {
    setEditableAnnotationSet,
    saveAnnotationSet,
    updateAnnotationSetField,
    reloadAnnotationSet
} from "./AnnotationSetEditActions";

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        fetchCorpora,
        setEditableCorpus,
        updateCorpusField,
        toggleCorpusAnnotationSet,
        fetchCorpusAnnotationSets,
        saveCorpus,
        reloadCorpus,
        fetchServerStatus,
        fetchAnnotationSets,
        setEditableAnnotationSet,
        saveAnnotationSet,
        updateAnnotationSetField,
        reloadAnnotationSet
    }
);