import createReducer from './CreateReducer'
import * as AnnotationFetchActions from '../actions/AnnotationFetchActions'
import fetchStatusType from "../actions/FetchStatusTypes";

export const annotations = createReducer({
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
    {
        [AnnotationFetchActions.REQUEST_ANNOTATIONS](draft, action) {
            draft.isFetching = true;
        },
        [AnnotationFetchActions.INVALIDATE_ANNOTATIONS](draft, action) {
            draft.didInvalidate = true;
        },
        [AnnotationFetchActions.RECEIVE_ANNOTATIONS](draft, action) {
            draft.isFetching = false;
            draft.didInvalidate = false;
            if (action.status === fetchStatusType.success) {
                draft.items = action.annotations;
                draft.lastUpdated = action.receivedAt;
                draft.status = fetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = fetchStatusType.error;
                draft.error = action.error;
            }
        }
    });
