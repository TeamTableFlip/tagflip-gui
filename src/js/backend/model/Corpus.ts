import {AnnotationSetAttributes, CorpusAttributes, DocumentAttributes} from "@fhswf/tagflip-common";
import AnnotationSet from "./AnnotationSet";

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
    annotationSets: AnnotationSet[] = [];

    private constructor() {

    }


}
