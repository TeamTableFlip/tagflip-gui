import createReducer from "./CreateReducer";
import * as AnnotationSetEditActions from "../actions/AnnotationSetActions";
import FetchStatusType from "../actions/FetchStatusTypes";
import { AnnotationSet } from "../../AnnotationSet";

/**
 * An empty AnnotationSet.
 * @param state The current redux state - does nothing here.
 * @param action The executed action - does nothing here.
 * @returns AnnotationSet
 */
export const emptyAnnotationSet = (state = {}, action) => AnnotationSet.EMPTY;

/**
 * An empty Annotation.
 * @param state The current redux state - does nothing here.
 * @param action The executed action - does nothing here.
 * @returns {{a_id: number, s_id: number, name: string, color: string}}
 */
export const emptyAnnotation = function (state = {}, action) {
    return {
        a_id: 0,
        s_id: 0,
        name: "",
        color: "#bbbbbb"
    };
};

const initialState = {
    values: {
        s_id: 0,
        name: "",
        description: "",
    },
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
            values: {
                a_id: 0,
                s_id: 0,
                name: "",
                color: "#bbbbbb"
            },
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
        draft.values = action.annotationSet;
        draft.didInvalidate = true;
        draft.annotations.didInvalidate = true;
    },
    [AnnotationSetEditActions.UPDATE_ANNOTATION_SET_FIELD](draft, action) {
        draft.values[action.field] = action.value;
    },
    [AnnotationSetEditActions.REQUEST_ACTIVE_ANNOTATION_SET](draft, action) {
        draft.isFetching = true;
    },
    [AnnotationSetEditActions.RECEIVE_ACTIVE_ANNOTATION_SET](draft, action) {
        draft.isFetching = false;
        draft.didInvalidate = false;
        if (action.status === FetchStatusType.success) {
            draft.values = action.annotationSet;
            draft.lastUpdated = action.receivedAt;
            draft.status = FetchStatusType.success;
            draft.error = null;
        } else {
            draft.status = FetchStatusType.error;
            draft.error = action.error;
        }
    },
    [AnnotationSetEditActions.REQUEST_ANNOTATIONS](draft, action) {
        draft.annotations.isFetching = true;
    },
    [AnnotationSetEditActions.INVALIDATE_ANNOTATIONS](draft, action) {
        draft.annotations.didInvalidate = true;
    },
    [AnnotationSetEditActions.RECEIVE_ANNOTATIONS](draft, action) {
        draft.annotations.isFetching = false;
        draft.annotations.didInvalidate = false;
        if (action.status === FetchStatusType.success) {
            draft.annotations.items = action.annotations;
            draft.annotations.lastUpdated = action.receivedAt;
            draft.annotations.status = FetchStatusType.success;
            draft.annotations.error = null;
        } else {
            draft.annotations.status = FetchStatusType.error;
            draft.annotations.error = action.error;
        }
    },
    [AnnotationSetEditActions.DELETE_ANNOTATION](draft, action) {
        draft.annotations.items = draft.annotations.items.filter(annotation =>
            annotation.a_id !== action.annotationId
        )
    },

    [AnnotationSetEditActions.SET_EDITABLE_ANNOTATION](draft, action) {
        draft.annotations.editableAnnotation.values = action.annotation;
    },
    [AnnotationSetEditActions.UPDATE_ANNOTATION_FIELD](draft, action) {
        draft.annotations.editableAnnotation.values[action.field] = action.value;
    },
    [AnnotationSetEditActions.REQUEST_SAVE_ANNOTATION](draft, action) {
        draft.annotations.editableAnnotation.isFetching = true;
    },
    [AnnotationSetEditActions.RECEIVE_SAVE_ANNOTATION](draft, action) {
        draft.annotations.editableAnnotation.isFetching = false;
        if (action.status === FetchStatusType.success) {
            draft.annotations.items = draft.annotations.items.filter(x => x.a_id !== action.annotation.a_id)
            draft.annotations.items.push(action.annotation);
            draft.annotations.editableAnnotation.values = action.annotation;
            draft.annotations.editableAnnotation.lastUpdated = action.receivedAt;
            draft.annotations.editableAnnotation.status = FetchStatusType.success;
            draft.annotations.editableAnnotation.error = null;
        } else {
            draft.annotations.editableAnnotation.status = FetchStatusType.error;
            draft.annotations.editableAnnotation.error = action.error;
        }
    }
});