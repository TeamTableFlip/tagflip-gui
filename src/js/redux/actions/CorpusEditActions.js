/**
 * Action creator for the action SET_SELECTED_CORPUS.
 *
 * @param corpus
 * @returns {{type: string, corpus: *}}
 */
export const SET_SELECTED_CORPUS = "SET_SELECTED_CORPUS";
export function setSelectedCorpus(corpus) {
    return {
        type: SET_SELECTED_CORPUS,
        corpus
    }
}
