import {AnnotationSetAttributes, CorpusAttributes} from "@fhswf/tagflip-common";

export default class AnnotationSet implements AnnotationSetAttributes {

    static create = (attributes?: AnnotationSetAttributes): AnnotationSet => {
        let object = Object.assign({}, new AnnotationSet());
        if (attributes)
            Object.assign(object, attributes)
        return object;
    }

    annotationSetId: number = 0;
    name: string = "";
    description: string = "";
    createdAt: Date = null;
    updatedAt: Date = null;

    private constructor() {

    }
}
