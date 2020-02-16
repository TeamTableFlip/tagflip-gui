import fetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";

/**
 * Action creator for the action SET_EDITABLE_CORPUS.
 *
 * @param corpus
 * @returns {{type: string, corpus: *}}
 */
export const SET_EDITABLE_CORPUS = "SET_EDITABLE_CORPUS";
export function setEditableCorpus(corpus) {
    return {
        type: SET_EDITABLE_CORPUS,
        corpus
    }
}

export const UPDATE_CORPUS_FIELD = "UPDATE_CORPUS_FIELD";
export function updateCorpusField(field, value) {
    return {
        type: UPDATE_CORPUS_FIELD,
        field,
        value
    }
}

export const TOGGLE_CORPUS_ANNOTATION_SET = "TOGGLE_CORPUS_ANNOTATION_SET";
export function toggleCorpusAnnotationSet(annotationSet) {
    return {
        type: TOGGLE_CORPUS_ANNOTATION_SET,
        annotationSet
    }
}


// Getting AnnotationSets for corpus

export const REQUEST_CORPUS_ANNOTATION_SETS = "REQUEST_CORPUS_ANNOTATION_SETS";
export function requestCorpusAnnotationSet() {
    return {
        type: REQUEST_CORPUS_ANNOTATION_SETS,
    }
}


export const INVALIDATE_CORPUS_ANNOTATION_SETS = "INVALIDATE_CORPUS_ANNOTATION_SETS";
export function invalidateCorpusAnnotationSet() {
    return {
        type: INVALIDATE_CORPUS_ANNOTATION_SETS,
    }
}


export const RECEIVE_CORPUS_ANNOTATION_SETS = "RECEIVE_CORPUS_ANNOTATION_SETS";
export function receiveCorpusAnnotationSet(annotationSets, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_ANNOTATION_SETS,
        annotationSets: annotationSets,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function fetchCorpusAnnotationSets(corpusId) {
    return (dispatch, getState) => {
        dispatch(invalidateCorpusAnnotationSet())
        dispatch(requestCorpusAnnotationSet())
        client.httpGet(`/corpus/${corpusId}/annotationset`)
            .then(result =>
                dispatch(receiveCorpusAnnotationSet(result))
            )
            .catch(error => dispatch(receiveCorpusAnnotationSet([], fetchStatusType.error, error)))
    }
}
