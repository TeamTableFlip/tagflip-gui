import {CorpusAttributes} from "@fhswf/tagflip-common";

export default class Corpus implements CorpusAttributes {

    static create = (): Corpus => {
        return Object.assign({}, new Corpus());
    };

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
