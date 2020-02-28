import createReducer from "./CreateReducer";
import * as AnnotationSetEditActions from "../actions/AnnotationSetActions";
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyAnnotationSet = function (state = {}, action) {
    return {
        s_id: 0,
        description: "",
        name: ""
    };
};


export const emptyAnnotation = function (state = {}, action) {
    return {
        a_id: 0,
        s_id: 0,
        name: "",
        color: "#bbbbbb"
    };
};

export const activeAnnotationSet = createReducer({
    values: {
        s_id: 0,
        name: "",
        description: "",
    },
    didInvalidate: false,
    isFetching: false,
    lastUpdated: undefined,
    status: fetchStatusType.success,
    error: null,
    annotations: {
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
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
            status: fetchStatusType.success,
            error: null
        },
    },
}, {
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
        if (action.status === fetchStatusType.success) {
            draft.values = action.annotationSet;
            draft.lastUpdated = action.receivedAt;
            draft.status = fetchStatusType.success;
            draft.error = null;
        } else {
            draft.status = fetchStatusType.error;
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
        if (action.status === fetchStatusType.success) {
            draft.annotations.items = action.annotations;
            draft.annotations.lastUpdated = action.receivedAt;
            draft.annotations.status = fetchStatusType.success;
            draft.annotations.error = null;
        } else {
            draft.annotations.status = fetchStatusType.error;
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
        if (action.status === fetchStatusType.success) {
            draft.annotations.items = draft.annotations.items.filter(x => x.a_id !== action.annotation.a_id)
            draft.annotations.items.push(action.annotation);
            draft.annotations.editableAnnotation.values = action.annotation;
            draft.annotations.editableAnnotation.lastUpdated = action.receivedAt;
            draft.annotations.editableAnnotation.status = fetchStatusType.success;
            draft.annotations.editableAnnotation.error = null;
        } else {
            draft.annotations.editableAnnotation.status = fetchStatusType.error;
            draft.annotations.editableAnnotation.error = action.error;
        }
    }
});