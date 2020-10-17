import {AnnotationAttributes, AnnotationSetAttributes} from "@fhswf/tagflip-common";

export default class Annotation implements AnnotationAttributes {

    static create = (attributes?: AnnotationAttributes): Annotation => {
        let object = Object.assign({}, new Annotation());
        if (attributes)
            Object.assign(object, attributes)
        return object;
    }

    annotationId: number = 0;
    annotationSetId: number = 0;
    name: string = "";
    color: string = "#000000".replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16);
    });
    createdAt: Date = null;
    updatedAt: Date = null;

    private constructor() {

    }
}
