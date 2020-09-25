import createReducer from './CreateReducer'
import FetchStatusType from "../actions/FetchStatusTypes";
import {AnnotationTaskListState, AnnotationTaskStateListState} from '../types';
import * as AnnotationTaskStateActions from "../actions/annotationtask/AnnotationTaskStateActions";
import {PayloadAction, PayloadStatusAction} from "../actions/types";
import AnnotationTask from "../../backend/model/AnnotationTask";
import AnnotationTaskState from "../../backend/model/AnnotationTaskState";

const initialState: AnnotationTaskStateListState = {
    isFetching: false,
    items: [],
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null
};

/**
 * All currently available corpora of the application.
 * @type {reducer}
 */
export const annotationTaskStates = createReducer(initialState,
    {
        [AnnotationTaskStateActions.FETCH_ANNOTATION_TASK_STATES]: (draft : AnnotationTaskStateListState, action : PayloadAction<any>) => {
            draft.isFetching = true
        },
        [AnnotationTaskStateActions.RECEIVE_ANNOTATION_TASK_STATES]: (draft : AnnotationTaskStateListState, action : PayloadStatusAction<AnnotationTaskState[]>) => {
            draft.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.items = action.payload.data;
                draft.lastUpdated = action.payload.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = FetchStatusType.error;
                draft.error = action.payload.error;
            }
        },
    });
