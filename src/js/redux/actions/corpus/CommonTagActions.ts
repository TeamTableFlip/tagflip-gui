import {
    createFetchErrorAction,
    createFetchSuccessAction,
    createPayloadAction,
    handleResponse,
    onTagFlipError,
    toJson
} from "../Common";
import Tag from "../../../backend/model/Tag";
import {ofType} from "redux-observable";
import {map, mergeMap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {HttpMethod, RequestBuilder} from "../../../backend/RequestBuilder";
import {createAction} from "@reduxjs/toolkit";
import {PayloadAction} from "../types";



export const DELETE_TAG = "DELETE_TAG_FOR_ACTIVE_DOCUMENT"
export const RECEIVE_DELETE_TAG = "RECEIVE_DELETE_TAG"
export const deleteTag = createPayloadAction<Tag>(DELETE_TAG);
export const deleteTagEpic = (action$, state$) => action$.pipe(
    ofType(DELETE_TAG),
    mergeMap((action: PayloadAction<Tag >) => {
            return fromFetch(RequestBuilder.DELETE(`/document/${action.payload.documentId}/tag/${action.payload.tagId}`)).pipe(
                handleResponse(
                    map((_) => createFetchSuccessAction(RECEIVE_DELETE_TAG)(action.payload)),
                    onTagFlipError((err) => createFetchErrorAction(RECEIVE_DELETE_TAG)(err))
                )
            )
        }
    )
)