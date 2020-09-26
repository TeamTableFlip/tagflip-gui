import FetchStatusType from "./FetchStatusTypes";

export interface BaseAction {
    type: any,
    payload: any
}

export interface PayloadAction<T> extends BaseAction {
    payload: T
}

export interface PayloadStatusAction<T> extends BaseAction {
    payload: {
        data: T,
        receivedAt: number,
        status: FetchStatusType,
        error: any
    }
}
