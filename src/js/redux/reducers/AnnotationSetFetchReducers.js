import createReducer from './CreateReducer'
import * as AnnotationSetFetchActions from '../actions/AnnotationSetFetchActions'

export const emptyAnnotationSet = function reducer(state = {}, action) {
    return {
        s_id: 0,
        name: "",
        description: "",
    };
}

export const annotationSets = createReducer({
        isFetching: false,
        didInvalidate: false,
        items: []
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
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.annotationSets,
                lastUpdated: action.receivedAt
            })
        }
    });
