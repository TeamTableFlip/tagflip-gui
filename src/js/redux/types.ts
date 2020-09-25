import FetchStatusType from "./actions/FetchStatusTypes";
import Corpus from '../backend/model/Corpus';
import AnnotationSet from '../backend/model/AnnotationSet';
import Annotation from '../backend/model/Annotation';
import Document from '../backend/model/Document';
import AnnotationTask from "../backend/model/AnnotationTask";
import AnnotationTaskState from "../backend/model/AnnotationTaskState";
import AnnotationTaskDocument from "../backend/model/AnnotationTaskDocument";

export interface FetchState {
    isFetching: boolean;
    lastUpdated: number;
    status: FetchStatusType;
    error: any;
}

export interface AnnotationSetListValue {
    items: AnnotationSet[];
    totalCount: number;
}

export interface AnnotationSetValue {
    values: AnnotationSet;
    annotations: FetchState & {
        items: Annotation[];
        editableAnnotation: FetchState & {
            values: Annotation;
        }
    }
}

export interface DocumentListValue {
    items: Document[];
    totalCount: number;
}

export interface DocumentValue {
    item: Document;
    tags: TagState;
}

export interface TagValue {
    items: any[];
}

export interface CorpusValue {
    values: Corpus;
    documents: DocumentListState;
    annotationSets: AnnotationSetListState;
    activeDocument: DocumentState;
}

export interface CorpusListValue {
    items: Corpus[];
    totalCount: number;
}

export interface ServerValue {
    available: boolean
}

export interface AnnotationTaskListValue {
    items: AnnotationTask[]
}

export interface AnnotationTaskStateListValue {
    items: AnnotationTaskState[]
}

export interface AnnotationTaskValue {
    values: AnnotationTask;
    documents: AnnotationTaskDocumentListState;
    activeDocument: AnnotationTaskDocumentState
}

export interface AnnotationTaskDocumentListValue {
    items: AnnotationTaskDocument[];
    totalCount: number;
}


export interface AnnotationTaskDocumentValue {
    values: AnnotationTaskDocument;
    tags: TagState;
}

export type AnnotationTaskStateListState = AnnotationTaskStateListValue & FetchState;
export type AnnotationTaskListState = AnnotationTaskListValue & FetchState;
export type AnnotationTaskValueState = AnnotationTaskValue & FetchState;
export type AnnotationTaskDocumentListState = AnnotationTaskDocumentListValue & FetchState;
export type AnnotationTaskDocumentState = AnnotationTaskDocumentValue & FetchState;

export type AnnotationSetState = AnnotationSetValue & FetchState;
export type AnnotationSetListState = AnnotationSetListValue & FetchState;

export type DocumentListState = DocumentListValue & FetchState;
export type DocumentState = DocumentValue & FetchState;

export type TagState = TagValue & FetchState;

export type CorpusState = CorpusValue & FetchState;
export type CorpusListState = CorpusListValue & FetchState;

export type ServerState = ServerValue & FetchState;
