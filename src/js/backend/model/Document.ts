import {DocumentAttributes, TagAttributes} from "@fhswf/tagflip-common";

export default class Document implements DocumentAttributes {

    static create = (attributes?: DocumentAttributes): Document => {
        let object = Object.assign({}, new Document());
        if (attributes)
            Object.assign(object, attributes)
        return object;
    }

    private constructor() {

    }

    content: string = "";
    corpusId: number = 0;
    documentHash: string = "";
    documentId: number = 0;
    filename: string = "";
    createdAt: Date = null;
    updatedAt: Date = null;
}
