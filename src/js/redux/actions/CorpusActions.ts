import FetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";
import { Corpus } from "../../Corpus";

// Actions for editing a corpus

/**
 * An empty Corpus object.
 * @param state The current redux state - does nothing here.
 * @param action The executed action - does nothing here.
 * @returns Corpus
 */
export const emptyCorpus = (state = {}, action) => Corpus.EMPTY;


export const SET_EDITABLE_CORPUS = "SET_EDITABLE_CORPUS";

/**
 * Action creator for the action SET_EDITABLE_CORPUS.
 *
 * @param corpus the corpus that should be edited.
 * @returns {{type: string, corpus: *}}
 */
export function setEditableCorpus(corpus) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_EDITABLE_CORPUS,
            corpus
        });
        if (corpus.c_id > 0) {
            dispatch(reloadCorpus());
        }
    }
}

export const UPDATE_CORPUS_FIELD = "UPDATE_CORPUS_FIELD";

/**
 * Action creator for the action UPDATE_CORPUS_FIELD.
 * @param field the field
 * @param value the new value
 */
export function updateCorpusField(field, value) {
    return {
        type: UPDATE_CORPUS_FIELD,
        field,
        value: value ? value : null
    }
}

// Actions for getting AnnotationSets while editing a corpus

export const REQUEST_CORPUS_ANNOTATION_SETS = "REQUEST_CORPUS_ANNOTATION_SETS";

/**
 * Action creator for the action REQUEST_CORPUS_ANNOTATION_SETS.
 * @returns {{type: *}}
 */
export function requestCorpusAnnotationSet() {
    return {
        type: REQUEST_CORPUS_ANNOTATION_SETS,
    }
}

export const INVALIDATE_CORPUS_ANNOTATION_SETS = "INVALIDATE_CORPUS_ANNOTATION_SETS";

/**
 * Action creator for the action INVALIDATE_CORPUS_ANNOTATION_SETS.
 * @returns {{type: *}}
 */
export function invalidateCorpusAnnotationSet() {
    return {
        type: INVALIDATE_CORPUS_ANNOTATION_SETS,
    }
}


export const RECEIVE_CORPUS_ANNOTATION_SETS = "RECEIVE_CORPUS_ANNOTATION_SETS";

/**
 * Action creator for the action RECEIVE_CORPUS_ANNOTATION_SETS.
 * @param annotationSets the Annotation Sets
 * @param status response status
 * @param error response error
 * @returns {{annotationSets: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveCorpusAnnotationSet(annotationSets, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_ANNOTATION_SETS,
        annotationSets: annotationSets,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * ActionC ceator for async fetching all corpora.
 * @param corpusId the id of the corpus
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
                .catch(error => dispatch(receiveCorpusAnnotationSet([], FetchStatusType.error, error)))
        }
    }
}

// Actions for selecting and unselecting AnnotationSets in active corpus.

export const ADD_CORPUS_ANNOTATION_SET = "ADD_CORPUS_ANNOTATION_SET";
export const REMOVE_CORPUS_ANNOTATION_SET = "REMOVE_CORPUS_ANNOTATION_SET";

/**
 * Async action to toggle selection for given AnnotationSet
 * @param annotationSet the AnnotationSet
 * @returns {Function}
 */
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
                .catch(error => dispatch(receiveCorpusAnnotationSet([], FetchStatusType.error, error)))
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
                .catch(error => dispatch(receiveCorpusAnnotationSet([], FetchStatusType.error, error)))
        }
    }
}


// Actions for saving edited corpus

export const REQUEST_UPDATE_CORPUS = "REQUEST_UPDATE_CORPUS";

/**
 * Action creator for the action REQUEST_UPDATE_CORPUS.
 * @returns {{type: *}}
 */
export function requestUpdateCorpus() {
    return {
        type: REQUEST_UPDATE_CORPUS,
    }
}

export const RECEIVE_UPDATE_CORPUS = "RECEIVE_UPDATE_CORPUS";

/**
 * Action creator for the action RECEIVE_UPDATE_CORPUS.
 * @param corpus the corpus
 * @param status response status
 * @param error response error
 * @returns {{corpus: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveUpdateCorpus(corpus, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_UPDATE_CORPUS,
        corpus: corpus,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Action creator for async saving the currently active corpus.
 * @returns {Function}
 */
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
                    dispatch(receiveUpdateCorpus({}, FetchStatusType.error, err))
                );
        } else {
            client.httpPut(`/corpus/${corpus.c_id}`, corpus)
                .then(result => {
                    dispatch(receiveUpdateCorpus(result));
                })
                .catch(err =>
                    dispatch(receiveUpdateCorpus({}, FetchStatusType.error, err))
                );
        }
    }
}

/**
 * Action creator for async reloading the currently active corpus and its dependencies.
 * @returns {Function}
 */
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
                .catch(error => dispatch(receiveUpdateCorpus({}, FetchStatusType.error, error)))
            dispatch(fetchCorpusAnnotationSets(corpus.c_id));
            dispatch(fetchCorpusDocuments(corpus.c_id));
        }
    }
}

// Actions for getting Documents while editing a corpus

export const REQUEST_CORPUS_DOCUMENTS = "REQUEST_CORPUS_DOCUMENTS";

/**
 * Action creator for the action REQUEST_CORPUS_DOCUMENTS.
 * @returns {{type: *}}
 */
export function requestCorpusDocuments() {
    return {
        type: REQUEST_CORPUS_DOCUMENTS,
    }
}


export const INVALIDATE_CORPUS_DOCUMENTS = "INVALIDATE_CORPUS_DOCUMENTS";

/**
 * Action creator for the action INVALIDATE_CORPUS_DOCUMENTS.
 * @returns {{type: *}}
 */
export function invalidateCorpusDocuments() {
    return {
        type: INVALIDATE_CORPUS_DOCUMENTS,
    }
}


export const RECEIVE_CORPUS_DOCUMENTS = "RECEIVE_CORPUS_DOCUMENTS";

/**
 * Action creator for the action RECEIVE_CORPUS_DOCUMENTS.
 * @param documents the documents
 * @param status response status
 * @param error response error
 * @returns {{documents: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveCorpusDocuments(documents, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_DOCUMENTS,
        documents: documents,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * Action creator for async fetching documents for given corpus
 * @param corpusId the id of the corpus
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
                .catch(error => dispatch(receiveCorpusDocuments([], FetchStatusType.error, error)))
        }
    }
}

// Actions for uploading Documents while editing a corpus


export const REQUEST_CORPUS_UPLOAD_DOCUMENTS = "REQUEST_CORPUS_UPLOAD_DOCUMENTS";

/**
 * Action creator for action REQUEST_CORPUS_UPLOAD_DOCUMENTS
 * @returns {{type: *}}
 */
export function requestCorpusUploadDocuments() {
    return {
        type: REQUEST_CORPUS_UPLOAD_DOCUMENTS,
    }
}


export const RECEIVE_CORPUS_UPLOAD_DOCUMENTS = "RECEIVE_CORPUS_UPLOAD_DOCUMENTS";

/**
 * Action creator for action RECEIVE_CORPUS_UPLOAD_DOCUMENTS
 * @param result the documents
 * @param status response status
 * @param error response error
 * @returns {{skippedDocuments: *, documents: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveCorpusUploadDocuments(result, status = FetchStatusType.success, error = null) {
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
 * Action creator for async uploading given files to given corpus.
 * @param corpusId the id of the corpus the file belong to
 * @param files the files
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
                    dispatch(receiveCorpusUploadDocuments(result))
                }
                )
                .catch(error => dispatch(receiveCorpusDocuments([], FetchStatusType.error, error)))
        }
    }
}

export const REQUEST_CORPUS_IMPORT = "REQUEST_CORPUS_IMPORT";

/**
 * Action creator for action REQUEST_CORPUS_UPLOAD
 * @returns {{type: *}}
 */
export function requestCorpusUpload() {
    return {
        type: REQUEST_CORPUS_IMPORT,
    }
}


export const RECEIVE_CORPUS_IMPORT = "RECEIVE_CORPUS_IMPORT";

/**
 * Action creator for action RECEIVE_CORPUS_UPLOAD_DOCUMENTS
 * @param result the documents
 * @param status response status
 * @param error response error
 * @returns {{skippedDocuments: *, documents: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveCorpusUpload(result, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_IMPORT,
        corpus: result.corpus,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Action creator for async uploading given files to given corpus.
 * @param corpusId the id of the corpus the file belong to
 * @param files the files
 * @returns {Function}
 */
export function uploadCorpus(files) {
    return (dispatch, getState) => {
        dispatch(requestCorpusUpload())
        let corpus = getState().editableCorpus.values;
        let annotationSets = getState().editableCorpus.annotationSets.items;
        let formData = new FormData()
        for (let file of files) {
            formData.append("file", file, file.name);
            formData.append("name", corpus.name)
            // TODO: allow multiple annotation sets
            formData.append("annotationSet", annotationSets[0].name)
        }

        client.httpPost(`/import`, formData, {}, false)
            .then(result => {
                dispatch(receiveCorpusUpload(result))
            }
            )
            .catch(error => dispatch(receiveCorpusUpload(null, FetchStatusType.error, error)))
    }
}

// Actions for deleting documents


export const CORPUS_DELETE_DOCUMENT = "CORPUS_DELETE_DOCUMENT";

/**
 * Action creator for async delete of given document.
 * @param documentId the id of the document
 * @returns {Function}
 */
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
            .catch(error => dispatch(receiveCorpusDocuments([], FetchStatusType.error, error)))
    }
}


// Actions for displaying document contents


export const REQUEST_CORPUS_DOCUMENT = "REQUEST_CORPUS_DOCUMENT";

/**
 * Action creator for action REQUEST_CORPUS_DOCUMENT
 * @returns {{type: *}}
 */
export function requestCorpusDocument() {
    return {
        type: REQUEST_CORPUS_DOCUMENT,
    }
}


export const RECEIVE_CORPUS_DOCUMENT = "RECEIVE_CORPUS_DOCUMENT";

/**
 * Action creator for action RECEIVE_CORPUS_DOCUMENT
 * @param result tge document
 * @param status response status
 * @param error response error
 * @returns {{document: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveCorpusDocument(result, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CORPUS_DOCUMENT,
        document: result,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}


/**
 * ActionCreator for fetching document by given id with our without tags.
 * @param documentId the id of the document
 * @param withTags flag that indicates whether tags should be also fetched or nor
 * @returns {Function}
 */
export function fetchCorpusDocument(documentId, withTags = false) {
    return (dispatch, getState) => {
        if (documentId > 0) {
            dispatch(requestCorpusDocument());
            client.httpGet(`/document/${documentId}`)
                .then(result => {
                    dispatch(receiveCorpusDocument(result));
                    if (withTags) {
                        dispatch(fetchTagsForActiveDocument())
                    }
                }
                )
                .catch(error => dispatch(receiveCorpusDocument(null, FetchStatusType.error, error)))
        }
    }
}


export const REQUEST_TAGS_FOR_ACTIVE_DOCUMENT = "REQUEST_TAGS_FOR_ACTIVE_DOCUMENT";

/**
 * Action creator for action REQUEST_TAGS_FOR_ACTIVE_DOCUMENT.
 * @returns {{type: *}}
 */
function requestTagsForActiveDocument() {
    return {
        type: REQUEST_TAGS_FOR_ACTIVE_DOCUMENT
    }
}


export const INVALIDATE_TAGS_FOR_ACTIVE_DOCUMENT = "INVALIDATE_TAGS_FOR_ACTIVE_DOCUMENT";

/**
 * Action creator for action INVALIDATE_TAGS_FOR_ACTIVE_DOCUMENT
 * @returns {{type: *}}
 */
function invalidateTagsForActiveDocument() {
    return {
        type: INVALIDATE_TAGS_FOR_ACTIVE_DOCUMENT,
    }
}


export const RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT = "RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT";

/**
 * Action creator for action RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT
 * @param tags the tags
 * @param status response status
 * @param error response error
 * @returns {{type: *, receivedAt: *, error: *, tags: *, status: *}}
 */
export function receiveTagsForActiveDocument(tags, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_TAGS_FOR_ACTIVE_DOCUMENT,
        tags: tags,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

// Actions for setting the current Document

/**
 * Action creator for async fetching tags for currently active document.
 * @returns {Function}
 */
export function fetchTagsForActiveDocument() {
    return (dispatch, getState) => {
        let documentId = getState().editableCorpus.activeDocument.item.d_id;
        dispatch(requestTagsForActiveDocument());
        dispatch(invalidateTagsForActiveDocument());
        client.httpGet(`/document/${documentId}/tag`)
            .then(result =>
                dispatch(receiveTagsForActiveDocument(result))
            )
            .catch(error => dispatch(receiveTagsForActiveDocument([], FetchStatusType.error, error)));
    };
}


export const REQUEST_SAVE_TAG = "REQUEST_SAVE_TAG";

/**
 * Action creator for action REQUEST_SAVE_TAG
 * @returns {{type: *}}
 */
export function requestSaveTag() {
    return {
        type: REQUEST_SAVE_TAG,
    };
}

export const RECEIVE_SAVE_TAG = "RECEIVE_SAVE_TAG";

/**
 * Action creator for action RECEIVE_SAVE_TAG
 * @param tag the tag
 * @param status the status
 * @param error the error
 * @returns {{tag: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveSaveTag(tag, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_SAVE_TAG,
        tag: tag,
        receivedAt: Date.now(),
        status: status,
        error: error
    };
}

/**
 * Action creator for async saving given tag.
 * @param newTag the tag
 * @returns {Function}
 */
export function saveTagForActiveDocument(newTag) {
    return (dispatch, getState) => {
        let document = getState().editableCorpus.activeDocument.item;
        if (!newTag.d_id) {
            Object.assign(newTag, {
                d_id: document.d_id
            })
        } else {
            if (newTag.d_id !== document.d_id) {
                console.log("New tag does not relate current selected document id");
                return;
            }
        }
        dispatch(requestSaveTag());
        client.httpPost('/tag', newTag)
            .then(result => {
                dispatch(receiveSaveTag(result));
            })
            .catch(err =>
                dispatch(receiveSaveTag([], FetchStatusType.error, err))
            );
    }
}


export const REQUEST_DELETE_TAG = "REQUEST_DELETE_TAG";

/**
 * Action creator for action REQUEST_DELETE_TAG
 * @returns {{type: *}}
 */
export function requestDeleteTag() {
    return {
        type: REQUEST_DELETE_TAG,
    }
}


export const RECEIVE_DELETE_TAG = "RECEIVE_DELETE_TAG";

/**
 * Action creator for action RECEIVE_DELETE_TAG
 * @param tagId the id of the tag
 * @param status response status
 * @param error response error
 * @returns {{tagId: *, type: *, receivedAt: *, error: *, status: *}}
 */
export function receiveDeleteTag(tagId, status = FetchStatusType.success, error = null) {
    return {
        type: RECEIVE_DELETE_TAG,
        tagId: tagId,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Action Creator for async deletion of given for currently active document.
 * @param tag the deletable tag
 * @returns {Function}
 */
export function deleteTagForActiveDocument(tag) {
    return (dispatch, getState) => {
        let document = getState().editableCorpus.activeDocument.item;
        if (!tag.d_id) {
            Object.assign(tag, {
                d_id: document.d_id
            })
        } else {
            if (tag.d_id !== document.d_id) {
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
                dispatch(receiveDeleteTag(tag.t_id, FetchStatusType.error, err))
            );
    }
}