import createReducer from "./CreateReducer";
import * as AnnotationSetEditActions from "../actions/AnnotationSetEditActions";

export const emptyAnnotationSet = function(state = {}, action) {
    return {
        s_id: 0,
        description: "",
        name: ""
    };
};

export const selectedAnnotationSet = createReducer({}, {
    [AnnotationSetEditActions.SET_SELECTED_ANNOTATIONSET](state, action) {
        return action.annotationSet;
    }
});