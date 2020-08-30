import createReducer from './CreateReducer'
import FetchStatusType from "../actions/FetchStatusTypes";
import {AnnotationTaskListState} from '../types';
import * as AnnotationTaskListActions from "../actions/annotationtask/AnnotationTaskListActions";
import * as AnnotationTaskActions from "../actions/annotationtask/AnnotationTaskActions";
import {PayloadAction, PayloadStatusAction} from "../actions/types";
import AnnotationTask from "../../backend/model/AnnotationTask";

const initialState: AnnotationTaskListState = {
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
export const annotationTasks = createReducer(initialState,
    {
        [AnnotationTaskListActions.GENERATE_ANNOTATION_TASKS]: (draft : AnnotationTaskListState, action : PayloadAction<any>) => {
            draft.isFetching = true
        },
        [AnnotationTaskListActions.RECEIVE_GENERATE_ANNOTATION_TASKS](draft: AnnotationTaskListState, action : PayloadStatusAction<AnnotationTask[]>) {
            draft.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.items = [...draft.items, ...action.payload.data];
                draft.lastUpdated = action.payload.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = FetchStatusType.error;
                draft.error = action.payload.error;
            }
        },

        [AnnotationTaskListActions.FETCH_ANNOTATION_TASKS]: (draft : AnnotationTaskListState, action : PayloadAction<any>) => {
            draft.isFetching = true
        },
        [AnnotationTaskListActions.RECEIVE_ANNOTATION_TASKS]: (draft : AnnotationTaskListState, action : PayloadStatusAction<AnnotationTask[]>) => {
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

        [AnnotationTaskListActions.RECEIVE_DELETE_ANNOTATION_TASK]: (draft : AnnotationTaskListState, action : PayloadStatusAction<number>) => {
            draft.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.items = draft.items.filter(x => x.annotationTaskId !== action.payload.data);
                draft.lastUpdated = action.payload.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
            } else {
                draft.status = FetchStatusType.error;
                draft.error = action.payload.error;
            }
        },
    });
