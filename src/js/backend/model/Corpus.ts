import {CorpusAttributes, DocumentAttributes} from "@fhswf/tagflip-common";

export default class Corpus implements CorpusAttributes {

    static create = (attributes?: CorpusAttributes): Corpus => {
        let object = Object.assign({}, new Corpus());
        if (attributes)
            Object.assign(object, attributes)
        return object;
    }

    corpusId: number = 0;
    name: string = "";
    description: string = "";
    createdAt: Date = null;
    updatedAt: Date = null;

    // Additional properties
    numDocuments: number = 0;

    private constructor() {

    }
}
