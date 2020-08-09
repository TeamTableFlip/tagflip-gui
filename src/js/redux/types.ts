import FetchStatusType from "./actions/FetchStatusTypes";
import { Corpus } from '../Corpus';
import { AnnotationSet } from '../AnnotationSet';

export interface FetchState {
    didInvalidate: boolean;
    isFetching: boolean;
    lastUpdated: number;
    status: FetchStatusType;
    error: any;
}

export interface AnnotationSetValue {
    items: AnnotationSet[];
}

export interface DocumentListValue {
    items: any[];
}

export interface DocumentValue {
    item: any;
    tags: TagState;
}

export interface TagValue {
    items: any[];
}

export interface CorpusValue {
    values: Corpus;
    annotationSets: AnnotationSetState;
    documents: DocumentListState;
    activeDocument: DocumentState;
}

export interface CorpusListValue {
    items: any[];
}

export interface ServerValue {
    available: boolean
}

export type AnnotationSetState = AnnotationSetValue & FetchState;
export type DocumentListState = DocumentListValue & FetchState;
export type DocumentState = DocumentValue & FetchState;
export type TagState = TagValue & FetchState;
export type CorpusState = CorpusValue & FetchState;
export type CorpusListState = CorpusListValue & FetchState;
export type ServerState = ServerValue & FetchState;
