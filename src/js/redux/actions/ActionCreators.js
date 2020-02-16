import {fetchCorpora} from "./CorpusFetchActions";
import {setEditableCorpus, fetchCorpusAnnotationSets, updateCorpusField} from './CorpusEditActions';
import {fetchServerStatus} from './ServerStatusFetchActions';
import {fetchAnnotationSets, saveAnnotationSet} from "./AnnotationSetFetchActions";
import {setSelectedAnnotationSet} from "./AnnotationSetEditActions";

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        fetchCorpora,
        setEditableCorpus,
        updateCorpusField,
        fetchCorpusAnnotationSets,
        fetchServerStatus,
        fetchAnnotationSets,
        setSelectedAnnotationSet,
        saveAnnotationSet
    }
);