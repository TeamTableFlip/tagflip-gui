import createReducer from './CreateReducer'
import * as AnnotationSetFetchActions from '../actions/annotationset/AnnotationSetListActions'
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
        [AnnotationSetFetchActions.FETCH_ANNOTATION_SETS](draft, action) {
            draft.isFetching = true;
            draft.didInvalidate = true;
        },
        [AnnotationSetFetchActions.RECEIVE_ANNOTATION_SETS](draft, action) {
            draft.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.items = action.payload.data;
                draft.lastUpdated = action.payload.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
                draft.didInvalidate = false;
            } else {
                draft.status = FetchStatusType.error;
                draft.error = action.payload.error;
            }
        },
        [AnnotationSetFetchActions.RECEIVE_DELETE_ANNOTATION_SET](draft, action) {
            draft.items = draft.items.filter(annotationSet => annotationSet.annotationSetId !== action.payload.data);
        }
    });
