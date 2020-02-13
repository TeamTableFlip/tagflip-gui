import {fetchCorpora} from "./CorpusFetchActions";
import {setSelectedCorpus} from './CorpusEditActions';
import {fetchServerStatus} from './ServerStatusFetchActions';
import {fetchAnnotationSets} from "./AnnotationSetFetchActions";
import {setSelectedAnnotationSet} from "./AnnotationSetEditActions";

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        fetchCorpora,
        setSelectedCorpus,
        fetchServerStatus,
        fetchAnnotationSets,
        setSelectedAnnotationSet
    }
);