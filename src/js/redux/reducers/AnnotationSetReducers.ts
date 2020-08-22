import createReducer from "./CreateReducer";
import FetchStatusType from "../actions/FetchStatusTypes";
import * as AnnotationSetEditActions from "../actions/annotationset/AnnotationSetActions";
import * as AnnotationEditActions from "../actions/annotationset/AnnotationActions";
import {AnnotationSetState} from "../types";
import Annotation from "../../backend/model/Annotation";
import AnnotationSet from "../../backend/model/AnnotationSet";


const initialState: AnnotationSetState = {
    values: AnnotationSet.create(),
    didInvalidate: false,
    isFetching: false,
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null,
    annotations: {
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: FetchStatusType.success,
        error: null,
        editableAnnotation: {
            values: Annotation.create(),
            didInvalidate: false,
            isFetching: false,
            lastUpdated: undefined,
            status: FetchStatusType.success,
            error: null
        },
    },
}

/**
 * The currently selected/active AnnotationSet to be used for editing or annotating.
 * Besides information about the AnnotationSet itself, it holds data about all its related annotations, and the
 * currently selected Annotation to be edited.
 * @type {reducer}
 */
export const activeAnnotationSet = createReducer(initialState, {
    [AnnotationSetEditActions.SET_ACTIVE_ANNOTATION_SET](draft, action) {
        draft.values = action.payload;
        draft.didInvalidate = true;
        draft.annotations.didInvalidate = true;
        draft.status = FetchStatusType.success;
        draft.error = null;
    },
    [AnnotationSetEditActions.UPDATE_ANNOTATION_SET_FIELD](draft, action) {
        draft.values[action.payload.field] = action.payload.value;
    },
    [AnnotationSetEditActions.FETCH_ACTIVE_ANNOTATION_SET](draft, action) {
        draft.isFetching = true;
    },
    [AnnotationSetEditActions.SAVE_ACTIVE_ANNOTATION_SET](draft, action) {
        draft.isFetching = true;
    },
    [AnnotationSetEditActions.RECEIVE_UPDATE_ACTIVE_ANNOTATION_SET](draft, action) {
        draft.isFetching = false;
        draft.didInvalidate = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.values = action.payload.data;
            draft.lastUpdated = action.payload.receivedAt;
            draft.status = FetchStatusType.success;
            draft.error = null;
        } else {
            draft.status = FetchStatusType.error;
            draft.error = action.payload.error;
        }
    },
    [AnnotationEditActions.FETCH_ACTIVE_ANNOTATIONSET_ANNOTATIONS](draft, action) {
        draft.annotations.isFetching = true;
        draft.annotations.didInvalidate = true;
    },
    [AnnotationEditActions.RECEIVE_ACTIVE_ANNOTATIONSET_ANNOTATIONS](draft, action) {
        draft.annotations.isFetching = false;
        draft.annotations.didInvalidate = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.annotations.items = action.payload.data;
            draft.annotations.lastUpdated = action.payload.receivedAt;
            draft.annotations.status = FetchStatusType.success;
            draft.annotations.error = null;
        } else {
            draft.annotations.status = FetchStatusType.error;
            draft.annotations.error = action.payload.error;
        }
    },
    [AnnotationEditActions.RECEIVE_DELETE_ACTIVE_ANNOTATIONSET_ANNOTATION](draft, action) {
        draft.annotations.items = draft.annotations.items.filter(annotation =>
            annotation.annotationId !== action.payload
        )
    },

    [AnnotationEditActions.SET_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION](draft, action) {
        draft.annotations.editableAnnotation.values = action.payload;
        draft.annotations.editableAnnotation.error = null
        draft.annotations.editableAnnotation.lastUpdated = Date.now();
        draft.annotations.editableAnnotation.status = FetchStatusType.success;
    },
    [AnnotationEditActions.UPDATE_ACTIVE_ANNOTATIONSET_EDITABLE_ANNOTATION](draft, action) {
        draft.annotations.editableAnnotation.values[action.payload.field] = action.payload.value;
    },
    [AnnotationEditActions.SAVE_ANNOTATION](draft, action) {
        draft.annotations.editableAnnotation.isFetching = true;
    },
    [AnnotationEditActions.RECEIVE_SAVE_ANNOTATION](draft, action) {
        draft.annotations.editableAnnotation.isFetching = false;
        if (action.payload.status === FetchStatusType.success) {
            draft.annotations.items = draft.annotations.items.filter(x => x.annotationId !== action.payload.data.annotationId)
            draft.annotations.items.push(action.payload.data);
            draft.annotations.editableAnnotation.values = action.payload.data;
            draft.annotations.editableAnnotation.lastUpdated = action.payload.receivedAt;
            draft.annotations.editableAnnotation.status = FetchStatusType.success;
            draft.annotations.editableAnnotation.error = null;
        } else {
            draft.annotations.editableAnnotation.status = FetchStatusType.error;
            draft.annotations.editableAnnotation.error = action.payload.error;
        }
    }
});
