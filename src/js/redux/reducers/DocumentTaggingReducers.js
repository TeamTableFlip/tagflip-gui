import createReducer from "./CreateReducer";
import * as DocumentEditActions from "../actions/DocumentTaggingActions";
import fetchStatusType from "../actions/FetchStatusTypes";

export const emptyDocument = function(state = {}, action) {
    return {
        d_id: 0,
        c_id: 0,
        filename: "",
        documentHash: "",
        lastEdited: Date.now()
    };
};

export const tagableDocument = createReducer({
    data: {
        values: {
            d_id: 0,
            c_id: 0,
            filename: "",
            documentHash: "",
            lastEdited: Date.now()
        },
        isFetching: false,
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
    tags: []
}, {
    [DocumentEditActions.SET_TAGABLE_DOCUMENT](draft, action) {
        draft.data.values = action.document;
    },
    [DocumentEditActions.REQUEST_TAGABLE_DOCUMENT](draft, action) {
        draft.data.isFetching = true;
    },
    [DocumentEditActions.RECEIVE_TAGABLE_DOCUMENT](draft, action) {
        draft.data.isFetching = false;
        if(action.status === fetchStatusType.success) {
            draft.data.value = action.document;
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