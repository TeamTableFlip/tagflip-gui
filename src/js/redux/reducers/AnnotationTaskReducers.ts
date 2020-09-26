import createReducer from './CreateReducer'
import FetchStatusType from "../actions/FetchStatusTypes";
import {AnnotationTaskValueState, CorpusState} from '../types';
import {BaseAction, PayloadAction, PayloadStatusAction} from "../actions/types";
import AnnotationTask from "../../backend/model/AnnotationTask";
import * as AnnotationTaskActions from "../actions/annotationtask/AnnotationTaskActions";
import {QueryParam} from "../../backend/RequestBuilder";
import AnnotationTaskDocument from "../../backend/model/AnnotationTaskDocument";
import * as TaggingActions from "../actions/corpus/CommonTagActions";
import Tag from "../../backend/model/Tag";

const initialState: AnnotationTaskValueState = {
    isFetching: false,
    values: AnnotationTask.create(),
    documents: {
        isFetching: false,
        error: null,
        lastUpdated: undefined,
        status: FetchStatusType.success,
        items:[],
        totalCount: 0
    },
    activeDocument: {
        isFetching: false,
        error: null,
        lastUpdated: undefined,
        status: FetchStatusType.success,
        values: AnnotationTaskDocument.create(),
        tags: {
            isFetching: false,
            error: null,
            lastUpdated: undefined,
            status: FetchStatusType.success,
            items: [],
        }
    },
    lastUpdated: undefined,
    status: FetchStatusType.success,
    error: null
};

/**
 * All currently available corpora of the application.
 * @type {reducer}
 */
export const activeAnnotationTask = createReducer(initialState,
    {
        [AnnotationTaskActions.SET_ACTIVE_ANNOTATION_TASK]: (draft: AnnotationTaskValueState, action: PayloadAction<AnnotationTask>) => {
            draft.values = action.payload;
            if (!action.payload || !action.payload.annotationTaskId || action.payload.annotationTaskId <= 0) {
                if(draft.values.annotationTaskId !== action.payload.annotationTaskId) {
                    draft.documents = initialState.documents;
                    draft.activeDocument = initialState.activeDocument
                }

                draft.values = initialState.values;
                draft.isFetching = false;
                draft.lastUpdated = undefined;
                draft.status = FetchStatusType.success;
                draft.error = null;
            }
        },
        [AnnotationTaskActions.FETCH_ACTIVE_ANNOTATION_TASK](draft: AnnotationTaskValueState, action: PayloadAction<number>) {
            draft.isFetching = true;
            if(draft.values.annotationTaskId !== action.payload) {
                draft.documents = initialState.documents;
                draft.activeDocument = initialState.activeDocument
            }
        },
        [AnnotationTaskActions.SAVE_ANNOTATION_TASK](draft: AnnotationTaskValueState, action: BaseAction) {
            draft.isFetching = true;
        },
        [AnnotationTaskActions.RECEIVE_UPDATE_ACTIVE_ANNOTATION_TASK](draft: AnnotationTaskValueState, action: PayloadStatusAction<AnnotationTask>) {
            draft.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                if(draft.values.annotationTaskId !== action.payload.data.annotationTaskId) {
                    draft.documents = initialState.documents;
                    draft.activeDocument = initialState.activeDocument
                }
                draft.values = action.payload.data;
                draft.lastUpdated = action.payload.receivedAt;
                draft.status = FetchStatusType.success;
                draft.error = null;
            } else {
                draft.isFetching = false;
                draft.status = FetchStatusType.error;
                draft.error = action.payload.error;
            }
        },

        [AnnotationTaskActions.ASSIGN_DOCUMENT_TO_ANNOTATION_TASK](draft: AnnotationTaskValueState, action: PayloadAction<QueryParam[]>) {
            draft.documents.isFetching = true;
        },
        [AnnotationTaskActions.RECEIVE_ASSIGN_DOCUMENT_TO_ANNOTATION_TASK](draft: AnnotationTaskValueState, action: PayloadStatusAction<AnnotationTaskDocument>) {
            draft.documents.items.push(action.payload.data)
            draft.documents.totalCount = draft.documents.totalCount + 1
        },

        [AnnotationTaskActions.FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENTS](draft: AnnotationTaskValueState, action: PayloadAction<QueryParam[]>) {
            draft.documents.isFetching = true;
        },
        [AnnotationTaskActions.RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT_COUNT](draft: AnnotationTaskValueState, action: PayloadStatusAction<number>) {
            draft.documents.totalCount = action.payload.data
        },
        [AnnotationTaskActions.RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENTS](draft: AnnotationTaskValueState, action: PayloadStatusAction<AnnotationTaskDocument[]>) {
            draft.documents.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.documents.items = action.payload.data;
                draft.documents.lastUpdated = action.payload.receivedAt;
                draft.documents.status = FetchStatusType.success;
                draft.documents.error = null;
            } else {
                draft.documents.isFetching = false;
                draft.documents.status = FetchStatusType.error;
                draft.documents.error = action.payload.error;
            }
        },


        [AnnotationTaskActions.FETCH_ACTIVE_ANNOTATION_TASK_DOCUMENT](draft: AnnotationTaskValueState, action: PayloadAction<number>) {
            draft.activeDocument.isFetching = true;
        },
        [AnnotationTaskActions.SAVE_ANNOTATION_TASK_DOCUMENT](draft: AnnotationTaskValueState, action: PayloadAction<number>) {
            draft.activeDocument.isFetching = true;
        },
        [AnnotationTaskActions.RECEIVE_ACTIVE_ANNOTATION_TASK_DOCUMENT](draft: AnnotationTaskValueState, action: PayloadStatusAction<AnnotationTaskDocument>) {
            draft.activeDocument.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.activeDocument.values = action.payload.data;
                draft.documents.lastUpdated = action.payload.receivedAt;
                draft.documents.status = FetchStatusType.success;
                draft.documents.error = null;
            } else {
                draft.documents.isFetching = false;
                draft.documents.status = FetchStatusType.error;
                draft.documents.error = action.payload.error;
            }
        },

        [AnnotationTaskActions.FETCH_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT](draft: AnnotationTaskValueState, action: PayloadAction<Tag>) {
            draft.activeDocument.tags.isFetching = true;
        },
        [AnnotationTaskActions.RECEIVE_TAGS_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT](draft: AnnotationTaskValueState, action: PayloadStatusAction<Tag[]>) {
            draft.activeDocument.tags.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.activeDocument.tags.items = action.payload.data;
                draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
                draft.activeDocument.tags.status = FetchStatusType.success;
                draft.activeDocument.tags.error = null;
            } else {
                draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
                draft.activeDocument.tags.status = FetchStatusType.error;
                draft.activeDocument.tags.error = action.payload.error;
            }
        },
        [AnnotationTaskActions.SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT](draft: AnnotationTaskValueState, action: PayloadAction<Tag>) {

        },
        [AnnotationTaskActions.RECEIVE_SAVE_TAG_FOR_ACTIVE_ANNOTATION_TASK_DOCUMENT](draft: AnnotationTaskValueState, action: PayloadStatusAction<Tag>) {
            draft.activeDocument.tags.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.activeDocument.tags.items.push(action.payload.data);
                draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
                draft.activeDocument.tags.status = FetchStatusType.success;
                draft.activeDocument.tags.error = null;
            } else {
                draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
                draft.activeDocument.tags.status = FetchStatusType.error;
                draft.activeDocument.tags.error = action.payload.error;
            }
        },
        [TaggingActions.RECEIVE_DELETE_TAG](draft: AnnotationTaskValueState, action: PayloadStatusAction<Tag>) {
            draft.activeDocument.tags.isFetching = false;
            if (action.payload.status === FetchStatusType.success) {
                draft.activeDocument.tags.items = draft.activeDocument.tags.items.filter(x => x.tagId !== action.payload.data.tagId);
                draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
                draft.activeDocument.tags.status = FetchStatusType.success;
                draft.activeDocument.tags.error = null;
            } else {
                draft.activeDocument.tags.lastUpdated = action.payload.receivedAt;
                draft.activeDocument.tags.status = FetchStatusType.error;
                draft.activeDocument.tags.error = action.payload.error;
            }
        },

    });
