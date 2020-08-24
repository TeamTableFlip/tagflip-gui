import {TagAttributes} from "@fhswf/tagflip-common";

export default class Tag implements TagAttributes {

    tagId: number = 0;
    annotationId: number = 0;
    documentId: number = 0;
    endIndex: number = 0;
    startIndex: number = 0;
    createdAt: Date = null;
    updatedAt: Date = null;

    private constructor() {

    }

    static create = (attributes?: TagAttributes): Tag => {
        let object = Object.assign({}, new Tag());
        if (attributes)
            Object.assign(object, attributes)
        return object;
    }


}
