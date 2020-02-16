import createReducer from './CreateReducer'
import * as AnnotationSetFetchActions from '../actions/AnnotationSetFetchActions'
import fetchStatusType from "../actions/FetchStatusTypes";

export const annotationSets = createReducer({
        isFetching: false,
        didInvalidate: false,
        items: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    },
    {
        [AnnotationSetFetchActions.REQUEST_ANNOTATION_SETS](state, action) {
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        },
        [AnnotationSetFetchActions.INVALIDATE_ANNOTATION_SETS](state, action) {
            return Object.assign({}, state, {
                didInvalidate: true
            })
        },
        [AnnotationSetFetchActions.RECEIVE_ANNOTATION_SETS](state, action) {
            if(action.status === fetchStatusType.success) {
                return Object.assign({}, state, {
                    isFetching: false,
                    didInvalidate: false,
                    items: action.annotationSets,
                    lastUpdated: action.receivedAt,
                    status: fetchStatusType.success,
                    error: null
                })
            } else {
                return Object.assign({}, state, {
                    isFetching: false,
                    didInvalidate: false,
                    status: fetchStatusType.error,
                    error: action.error
                })
            }
        }
    });
