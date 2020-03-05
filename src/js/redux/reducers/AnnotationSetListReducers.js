import createReducer from './CreateReducer'
import * as AnnotationSetFetchActions from '../actions/AnnotationSetListActions'
import fetchStatusType from "../actions/FetchStatusTypes";

/**
 * All currently available AnnotationSets of the application.
 * @type {reducer}
 */
export const annotationSets = createReducer({
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
    {
        [AnnotationSetFetchActions.REQUEST_ANNOTATION_SETS](draft, action) {
            draft.isFetching = true;
        },
        [AnnotationSetFetchActions.INVALIDATE_ANNOTATION_SETS](draft, action) {
            draft.didInvalidate = true
        },
        [AnnotationSetFetchActions.RECEIVE_ANNOTATION_SETS](draft, action) {
            draft.isFetching = false;
            draft.didInvalidate = false;
            if (action.status === fetchStatusType.success) {
                draft.items = action.annotationSets;
                draft.lastUpdated = action.receivedAt;
                draft.status = fetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = fetchStatusType.error;
                draft.error = action.error;
            }
        },
        [AnnotationSetFetchActions.DELETE_ANNOTATION_SET](draft, action) {
            draft.items = draft.items.filter(annotationSet => annotationSet.s_id !== action.annotationSetId);
        }
    });
