import {AnnotationTaskStateAttributes} from "@fhswf/tagflip-common";

export default class AnnotationTaskState implements AnnotationTaskStateAttributes {

    annotationTaskStateId: number;

    createdAt: Date;

    name: string;

    color: string;

    visible: boolean;

    updatedAt: Date;

}
