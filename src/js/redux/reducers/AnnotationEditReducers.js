import createReducer from "./CreateReducer";
import * as AnnotationEditActions from "../actions/AnnotationEditActions";
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyAnnotation = function(state = {}, action) {
    return {
        a_id: 0,
        s_id: 0,
        name: "",
        color: "#bbbbbb"
    };
};

export const editableAnnotation = createReducer({
    data: {
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
    }
}, {
    [AnnotationEditActions.SET_EDITABLE_ANNOTATION](draft, action) {
        draft.data.values = action.annotationSet;
    },
    [AnnotationEditActions.UPDATE_ANNOTATION_FIELD](draft, action) {
        draft.data.values[action.field] = action.value;
    },
    [AnnotationEditActions.REQUEST_EDITABLE_ANNOTATION](draft, action) {
        draft.data.isFetching = true;
    },
    [AnnotationEditActions.RECEIVE_EDITABLE_ANNOTATION](draft, action) {
        draft.data.isFetching = false;
        if(action.status === fetchStatusType.success) {
            draft.data.value = action.annotationSet;
            draft.data.lastUpdated = action.receivedAt;
            draft.data.status = fetchStatusType.success;
            draft.data.error = null;
        }
        else {
            draft.data.status = fetchStatusType.error;
            draft.data.error = action.error;
        }
    }
});