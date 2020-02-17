import createReducer from "./CreateReducer";
import * as AnnotationSetEditActions from "../actions/AnnotationSetEditActions";
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyAnnotationSet = function(state = {}, action) {
    return {
        s_id: 0,
        description: "",
        name: ""
    };
};

export const editableAnnotationSet = createReducer({
    data: {
        values: {
            s_id: 0,
            name: "",
            description: "",
        },
        isFetching: false,
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null,
    },
}, {
    [AnnotationSetEditActions.SET_SELECTED_ANNOTATION_SET](draft, action) {
        draft.data.values = action.annotationSet;
    },
    [AnnotationSetEditActions.UPDATE_ANNOTATION_SET_FIELD](draft, action) {
        draft.data.values[action.field] = action.value;
    },
    [AnnotationSetEditActions.REQUEST_EDITABLE_ANNOTATION_SET](draft, action) {
        draft.data.isFetching = true;
    },
    [AnnotationSetEditActions.RECEIVE_EDITABLE_ANNOTATION_SET](draft, action) {
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