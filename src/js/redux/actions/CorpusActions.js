import fetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";

// Actions for editing a corpus
/**
 * Action creator for the action SET_EDITABLE_CORPUS.
 *
 * @param corpus
 * @returns {{type: string, corpus: *}}
 */
export const SET_EDITABLE_CORPUS = "SET_EDITABLE_CORPUS";

export function setEditableCorpus(corpus) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_EDITABLE_CORPUS,
            corpus
        });
        if(corpus.c_id > 0) {
            dispatch(reloadCorpus());
        }
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
        let corpusId = getState().editableCorpus.values.c_id
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
        let corpus = getState().editableCorpus.values;
        dispatch(requestUpdateCorpus());
        // Decide whether to PUT for update or POST for create
        console.log(corpus.c_id)
        if (!corpus.c_id || corpus.c_id <= 0) {
            client.httpPost('/corpus', corpus)
                .then(result => {
                    dispatch(receiveUpdateCorpus(result));
                    dispatch(reloadCorpus())
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
        let corpus = getState().editableCorpus.values;
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
            dispatch(fetchCorpusDocuments(corpus.c_id));
        }
    }
}

// Actions for getting Documents while editing a corpus

export const REQUEST_CORPUS_DOCUMENTS = "REQUEST_CORPUS_DOCUMENTS";

export function requestCorpusDocuments() {
    return {
        type: REQUEST_CORPUS_DOCUMENTS,
    }
}


export const INVALIDATE_CORPUS_DOCUMENTS = "INVALIDATE_CORPUS_DOCUMENTS";

export function invalidateCorpusDocuments() {
    return {
        type: INVALIDATE_CORPUS_DOCUMENTS,
    }
}


export const RECEIVE_CORPUS_DOCUMENTS = "RECEIVE_CORPUS_DOCUMENTS";

export function receiveCorpusDocuments(documents, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_DOCUMENTS,
        documents: documents,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function fetchCorpusDocuments(corpusId) {
    return (dispatch, getState) => {
        if (corpusId > 0) {
            dispatch(invalidateCorpusDocuments())
            dispatch(requestCorpusDocuments())
            client.httpGet(`/corpus/${corpusId}/document`)
                .then(result =>
                    dispatch(receiveCorpusDocuments(result))
                )
                .catch(error => dispatch(receiveCorpusDocuments([], fetchStatusType.error, error)))
        }
    }
}

// Actions for uploading Documents while editing a corpus

export const REQUEST_CORPUS_UPLOAD_DOCUMENTS = "REQUEST_CORPUS_UPLOAD_DOCUMENTS";

export function requestCorpusUploadDocuments() {
    return {
        type: REQUEST_CORPUS_UPLOAD_DOCUMENTS,
    }
}

export const RECEIVE_CORPUS_UPLOAD_DOCUMENTS = "RECEIVE_CORPUS_UPLOAD_DOCUMENTS";

export function receiveCorpusUploadDocuments(result, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_UPLOAD_DOCUMENTS,
        documents: result.items,
        skippedDocuments: result.skippedItems,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Fetch all corpora from the REST API.
 * @returns {Function}
 */
export function uploadCorpusDocuments(corpusId, files) {
    return (dispatch, getState) => {
        if (corpusId > 0) {
            dispatch(requestCorpusUploadDocuments())

            let formData = new FormData()
            for (let file of files) {
                formData.append("file", file, file.name)
            }

            client.httpPost(`/corpus/${corpusId}/import`, formData, {}, false)
                .then(result => {
                    dispatch(receiveCorpusUploadDocuments(result))}
                )
                .catch(error => dispatch(receiveCorpusDocuments([], fetchStatusType.error, error)))
        }
    }
}


// Actions for deleting documents
export const CORPUS_DELETE_DOCUMENT = "CORPUS_DELETE_DOCUMENT";

export function deleteCorpusDocument(documentId) {
    return (dispatch, getState) => {
        client.httpDelete(`/document/${documentId}`)
            .then(result => {
                    dispatch({
                        type: CORPUS_DELETE_DOCUMENT,
                        documentId
                    });
                }
            )
            .catch(error => dispatch(receiveCorpusDocuments([], fetchStatusType.error, error)))
    }
}


// Actions for displaying document contents

export const REQUEST_CORPUS_DOCUMENT = "REQUEST_CORPUS_DOCUMENT";

export function requestCorpusDocument() {
    return {
        type: REQUEST_CORPUS_DOCUMENT,
    }
}

export const RECEIVE_CORPUS_DOCUMENT = "RECEIVE_CORPUS_DOCUMENT";

export function receiveCorpusDocument(result, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_DOCUMENT,
        document: result,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


export function fetchCorpusDocument(documentId, withTags=false) {
    return (dispatch, getState) => {
        if (documentId > 0) {
            dispatch(requestCorpusDocument());
            client.httpGet(`/document/${documentId}`)
                .then(result => {
                        dispatch(receiveCorpusDocument(result));
                        if(withTags) {
                            dispatch(fetchTagsForActiveDocument())
                        }
                    }
                )
                .catch(error => dispatch(receiveCorpusDocument(null, fetchStatusType.error, error)))
        }
    }
}


export const REQUEST_TAGS_FOR_ACTIVE_DOCUMENT = "REQUEST_TAGS_FOR_ACTIVE_DOCUMENT";
function requestTagsForActiveDocument() {
    return {
        type: REQUEST_TAGS_FOR_ACTIVE_DOCUMENT
    }
}

export const INVALIDATE_TAGS_FOR_ACTIVE_DOCUMENT = "INVALIDATE_TAGS_FOR_ACTIVE_DOCUMENT";
function invalidateTagsForActiveDocument() {
    return {
        type: INVALIDATE_TAGS_FOR_ACTIVE_DOCUMENT,
    }
}


export const RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT = "RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT";

export function receiveTagsForActiveDocument(tags, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT,
        tags: tags,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

// Actions for setting the current Document
export function fetchTagsForActiveDocument() {
    return (dispatch, getState) => {
        let documentId = getState().editableCorpus.activeDocument.item.d_id
        dispatch(requestTagsForActiveDocument());
        dispatch(invalidateTagsForActiveDocument());
        client.httpGet(`/document/${documentId}/tag`)
            .then(result =>
                dispatch(receiveTagsForActiveDocument(result))
            )
            .catch(error => dispatch(receiveTagsForActiveDocument([], fetchStatusType.error, error)))
    }
}


export const REQUEST_SAVE_TAG = "REQUEST_SAVE_TAG";

export function requestSaveTag() {
    return {
        type: REQUEST_SAVE_TAG,
    }
}


export const RECEIVE_SAVE_TAG = "RECEIVE_SAVE_TAG";

export function receiveSaveTag(tag, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_SAVE_TAG,
        tag: tag,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export function saveTagForActiveDocument(newTag) {
    return (dispatch, getState) => {
        let document = getState().editableCorpus.activeDocument.item;
        if(!newTag.d_id) {
            Object.assign(newTag, {
                d_id: document.d_id
            })
        } else {
            if(newTag.d_id !== document.d_id) {
                console.log("New tag does not relate current selected document id")
                return;
            }
        }
        dispatch(requestSaveTag());
        client.httpPost('/tag', newTag)
            .then(result => {
                dispatch(receiveSaveTag(result));
            })
            .catch(err =>
                dispatch(receiveSaveTag([], fetchStatusType.error, err))
            );
    }
}


export const REQUEST_DELETE_TAG = "REQUEST_DELETE_TAG";

export function requestDeleteTag() {
    return {
        type: REQUEST_DELETE_TAG,
    }
}


export const RECEIVE_DELETE_TAG = "RECEIVE_DELETE_TAG";

export function receiveDeleteTag(tagId, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_DELETE_TAG,
        tagId: tagId,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export function deleteTagForActiveDocument(tag) {
    return (dispatch, getState) => {
        let document = getState().editableCorpus.activeDocument.item;
        if(!tag.d_id) {
            Object.assign(tag, {
                d_id: document.d_id
            })
        } else {
            if(tag.d_id !== document.d_id) {
                console.log("New tag does not relate current selected document id")
                return;
            }
        }
        dispatch(requestDeleteTag());
        client.httpDelete(`/tag/${tag.t_id}`)
            .then(result => {
                dispatch(receiveDeleteTag(tag.t_id));
            })
            .catch(err =>
                dispatch(receiveDeleteTag(tag.t_id, fetchStatusType.error, err))
            );
    }
}