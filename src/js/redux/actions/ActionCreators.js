import {fetchCorpora} from "./CorpusFetchActions";
import {setSelectedCorpus} from './CorpusEditActions';
import {fetchServerStatus} from './ServerStatusFetchActions';

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        fetchCorpora,
        setSelectedCorpus,
        fetchServerStatus
    }
);