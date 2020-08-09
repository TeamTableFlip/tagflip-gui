import createReducer from './CreateReducer'
import * as AnnotationSetFetchActions from '../actions/AnnotationSetListActions'
import FetchStatusType from "../actions/FetchStatusTypes";
import { AnnotationSetListState } from '../types';

const initialState: AnnotationSetListState = {
    isFetching: false,
    didInvalidate: false,
    items: [],
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null
}

/**
 * All currently available AnnotationSets of the application.
 * @type {reducer}
 */
export const annotationSets = createReducer(initialState,
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
            if (action.status === FetchStatusType.success) {
                draft.items = action.annotationSets;
                draft.lastUpdated = action.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = FetchStatusType.error;
                draft.error = action.error;
            }
        },
        [AnnotationSetFetchActions.DELETE_ANNOTATION_SET](draft, action) {
            draft.items = draft.items.filter(annotationSet => annotationSet.s_id !== action.annotationSetId);
        }
    });
