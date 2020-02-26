import fetchStatusType from "./FetchStatusTypes";
import client from "../../backend/RestApi";

// Actions for setting the current Document

export const SET_TAGABLE_DOCUMENT = "SET_TAGABLE_DOCUMENT";
export function setTagableDocument(document) {
    return {
        type: SET_TAGABLE_DOCUMENT,
        document: document
    }
}

// Actions for saving the editable Annotation in the backend

export const REQUEST_TAGABLE_DOCUMENT = "REQUEST_TAGABLE_DOCUMENT";
export function requestTagableDocument() {
    return {
        type: REQUEST_TAGABLE_DOCUMENT
    }
}

export const RECEIVE_TAGABLE_DOCUMENT = "RECEIVE_TAGABLE_DOCUMENT";
export function receiveTagableDocument(document, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_TAGABLE_DOCUMENT,
        document: document,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}
