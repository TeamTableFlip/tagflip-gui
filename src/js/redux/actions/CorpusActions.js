import * as actions from './Types';

/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function fetchCorpora() {
    return (dispatch, getState) => {
        // TODO: Remove mock and call the REST API
        dispatch(setCorpora(
            [
                {
                    c_id: 1,
                    name: 'Curriculum Vitaes',
                    description: 'Every CV of the last two years.',
                    num_documents: 4654
                },
                {
                    c_id: 2,
                    name: 'Jobs',
                    description: 'Job offers of this year.',
                    num_documents: 713
                }
            ]
        ));
    }
}

/**
 * Action creator for the action ACTION_SET_CORPORA.
 *
 * @param corpora
 * @returns {{type: string, corpora: *}}
 */
export function setCorpora(corpora) {
    return {
        type: actions.ACTION_SET_CORPORA,
        corpora
    }
}

/**
 * Action creator for the action ACTION_SET_ACTIVE_EDIT_CORPUS.
 *
 * @param corpus
 * @returns {{type: string, corpus: *}}
 */
export function setActiveEditCorpus(corpus) {
    return {
        type: actions.ACTION_SET_ACTIVE_EDIT_CORPUS,
        corpus
    }
}

/**
 * Action creator for the action ACTION_SET_ACTIVE_EDIT_CORPUS.
 *
 * @param corpus
 * @returns {{type: string, corpus: *}}
 */
export function setActiveEditCorpus(corpus) {
    return {
        type: actions.ACTION_SET_ACTIVE_EDIT_CORPUS,
        corpus
    }
}