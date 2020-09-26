import {
    Meta,
    AnnotationTaskAttributes,
    CorpusAttributes, AnnotationTaskMeta
} from "@fhswf/tagflip-common";

export default class AnnotationTask implements AnnotationTaskAttributes, Meta<AnnotationTaskMeta> {

    private _attributes: AnnotationTaskAttributes & Meta<AnnotationTaskMeta>

    private constructor() {
        this._attributes = {
            annotationTaskId: 0,
            annotationTaskStateId: 0,
            corpusId: 0,
            createdAt: undefined,
            description: "",
            name: "",
            priority: 0,
            updatedAt: undefined
        }
    }

    public static create = (attributes?: AnnotationTaskAttributes): AnnotationTask => {
        let annotationTask = new AnnotationTask();
        if (attributes) {
            for (let key of Object.keys(attributes)) {
                annotationTask[key] = attributes[key];
            }
        }

        return annotationTask;
    }


    get annotationTaskId(): number {
        return this._attributes.annotationTaskId;
    }

    set annotationTaskId(value: number) {
        this._attributes.annotationTaskId = value;
    }

    get corpusId(): number {
        return this._attributes.corpusId;
    }

    set corpusId(value: number) {
        this._attributes.corpusId = value;
    }

    get corpus(): CorpusAttributes {
        return this._attributes.corpus;
    }

    set corpus(value: CorpusAttributes) {
        this._attributes.corpus = value;
    }

    get annotationTaskStateId(): number {
        return this.annotationTaskStateId;
    }

    set annotationTaskStateId(value: number) {
        this._attributes.annotationTaskStateId = value;
    }

    get priority(): number {
        return this.priority;
    }

    set priority(value: number) {
        this._attributes.priority = value;
    }

    get createdAt(): Date {
        return this.createdAt;
    }

    set createdAt(value: Date) {
        this._attributes.createdAt = value;
    }

    get description(): string {
        return this.description;
    }

    set description(value: string) {
        this._attributes.description = value;
    }

    get name(): string {
        return this.name;
    }

    set name(value: string) {
        this._attributes.name = value;
    }

    get updatedAt(): Date {
        return this.updatedAt;
    }

    set updatedAt(value: Date) {
        this._attributes.updatedAt = value;
    }

    get meta(): AnnotationTaskMeta {
        return this.meta;
    }

    set meta(value: AnnotationTaskMeta) {
        this._attributes.meta = value;
    }

    public toJSON() {
        return {... this._attributes}
    }

    static getInProgressPercentage = (annotationTask : AnnotationTaskAttributes &  Meta<AnnotationTaskMeta>) => {
        let numberOfDocuments = annotationTask.meta.numberOfDocuments ? annotationTask.meta.numberOfDocuments : 0;
        let numberOfOpenDocuments = annotationTask.meta.numberOfOpenDocuments ? annotationTask.meta.numberOfOpenDocuments : 0;
        let numberOfClosedDocuments = annotationTask.meta.numberOfClosedDocuments ? annotationTask.meta.numberOfClosedDocuments : 0;
        if (numberOfDocuments === 0)
            return 0;

        return (100.0 * (numberOfDocuments - numberOfOpenDocuments - numberOfClosedDocuments) / numberOfDocuments);
    }

    static getClosedPercentage = (annotationTask : AnnotationTaskAttributes &  Meta<AnnotationTaskMeta>) => {
        let numberOfDocuments = annotationTask.meta.numberOfDocuments ? annotationTask.meta.numberOfDocuments : 0;
        let numberOfClosedDocuments = annotationTask.meta.numberOfClosedDocuments ? annotationTask.meta.numberOfClosedDocuments : 0;

        if (numberOfDocuments === 0)
            return 0;

        return (100.0 * (numberOfClosedDocuments) / numberOfDocuments);
    }

}
