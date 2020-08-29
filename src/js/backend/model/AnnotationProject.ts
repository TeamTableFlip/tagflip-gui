import {AnnotationProjectAttributes, AnnotationSetAttributes, CorpusAttributes} from "@fhswf/tagflip-common";

export default class AnnotationProject implements AnnotationProjectAttributes {

    annotationProjectId: number = 0;

    annotationSets: AnnotationSetAttributes[] = [];

    corpus: CorpusAttributes = undefined;

    corpusId: number = 0;

    createdAt: Date = null;

    description: string = undefined;

    name: string  = undefined;

    updatedAt: Date = null;

    private constructor() {

    }

    static create = (): AnnotationProject => {
        return Object.assign({}, new AnnotationProject());
    };


}
