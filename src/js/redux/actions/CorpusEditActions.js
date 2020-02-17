import fetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";
import {receiveSaveAnnotationSet, requestSaveAnnotationSet} from "./AnnotationSetFetchActions";

// Actions for editing a corpus

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
        value: value ? value : null
    }
}

// Actions for getting AnnotationSets while editing a corpus

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
        if (corpusId > 0) {
            dispatch(invalidateCorpusAnnotationSet())
            dispatch(requestCorpusAnnotationSet())
            client.httpGet(`/corpus/${corpusId}/annotationset`)
                .then(result =>
                    dispatch(receiveCorpusAnnotationSet(result))
                )
                .catch(error => dispatch(receiveCorpusAnnotationSet([], fetchStatusType.error, error)))
        }
    }
}


export const ADD_CORPUS_ANNOTATION_SET = "ADD_CORPUS_ANNOTATION_SET";
export const REMOVE_CORPUS_ANNOTATION_SET = "REMOVE_CORPUS_ANNOTATION_SET";

export function toggleCorpusAnnotationSet(annotationSet) {
    return (dispatch, getState) => {
        let corpusId = getState().editableCorpus.data.values.c_id
        let selectedAnnotationSets = getState().editableCorpus.annotationSets.items;
        let selectedAnnotationSetIds = new Set(selectedAnnotationSets.map(s => s.s_id));

        if (selectedAnnotationSetIds.has(annotationSet.s_id)) {
            //delete
            client.httpDelete(`/corpus/${corpusId}/annotationset/${annotationSet.s_id}`)
                .then(result =>
                    dispatch({
                        type: REMOVE_CORPUS_ANNOTATION_SET,
                        annotationSet
                    })
                )
                .catch(error => dispatch(receiveCorpusAnnotationSet([], fetchStatusType.error, error)))
        } else {
            // add
            client.httpPut(`/corpus/${corpusId}/annotationset/${annotationSet.s_id}`)
                .then(result => {
                        console.log("lol")
                        dispatch({
                            type: ADD_CORPUS_ANNOTATION_SET,
                            annotationSet
                        })
                    }
                )
                .catch(error => dispatch(receiveCorpusAnnotationSet([], fetchStatusType.error, error)))
        }
    }
}


// Actions for saving edited corpus

export const REQUEST_UPDATE_CORPUS = "REQUEST_UPDATE_CORPUS";

export function requestUpdateCorpus() {
    return {
        type: REQUEST_UPDATE_CORPUS,
    }
}


export const RECEIVE_UPDATE_CORPUS = "RECEIVE_UPDATE_CORPUS";

export function receiveUpdateCorpus(corpus, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_UPDATE_CORPUS,
        corpus: corpus,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export function saveCorpus() {
    return (dispatch, getState) => {
        let corpus = getState().editableCorpus.data.values;
        dispatch(requestUpdateCorpus());
        // Decide whether to PUT for update or POST for create
        // FIXME: Backend responds with 400, Bad request
        if (!corpus.c_id || corpus.c_id <= 0) {
            client.httpPost('/corpus', corpus)
                .then(result => {
                    dispatch(receiveUpdateCorpus(result));
                })
                .catch(err =>
                    dispatch(receiveUpdateCorpus({}, fetchStatusType.error, err))
                );
        } else {
            client.httpPut(`/corpus/${corpus.c_id}`, corpus)
                .then(result => {
                    dispatch(receiveUpdateCorpus(result));
                })
                .catch(err =>
                    dispatch(receiveUpdateCorpus({}, fetchStatusType.error, err))
                );
        }
    }
}

// ActionCreators for reloading editable corpus
export function reloadCorpus() {
    return (dispatch, getState) => {
        let corpus = getState().editableCorpus.data.values;
        console.log("Reloading corpus", corpus)
        if (corpus.c_id > 0) {
            dispatch(requestUpdateCorpus());
            client.httpGet(`/corpus/${corpus.c_id}`)
                .then(result => {
                        dispatch(receiveUpdateCorpus(result));
                    }
                )
                .catch(error => dispatch(receiveUpdateCorpus({}, fetchStatusType.error, error)))
            dispatch(fetchCorpusAnnotationSets(corpus.c_id));
        }
    }
}
