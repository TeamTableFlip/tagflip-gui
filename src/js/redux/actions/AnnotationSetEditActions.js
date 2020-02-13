/**
 * Action creator for the action SET_SELECTED_ANNOTATIONSET.
 *
 * @param corpus
 * @returns {{type: string, annotationSet: *}}
 */
export const SET_SELECTED_ANNOTATIONSET = "SET_SELECTED_ANNOTATIONSET";
export function setSelectedAnnotationSet(annotationSet) {
    return {
        type: SET_SELECTED_ANNOTATIONSET,
        annotationSet
    }
}
