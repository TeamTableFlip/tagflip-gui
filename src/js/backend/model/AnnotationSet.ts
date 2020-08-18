import {AnnotationSetAttributes} from "tagflip-common";

export default class AnnotationSet implements AnnotationSetAttributes {

    static create = (): AnnotationSet => {
        return Object.assign({}, new AnnotationSet());
    }

    annotationSetId: number = 0;
    name: string = "";
    description: string = "";
    createdAt: Date = null;
    updatedAt: Date = null;

    private constructor() {

    }
}
