import {DocumentAttributes} from "tagflip-common";

export default class Document implements DocumentAttributes {

    static create = () : Document  => {
        return Object.assign({}, new Document());
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
