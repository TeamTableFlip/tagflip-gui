import { Annotation } from "@codemirror/next/state"

export class AnnotationSet {
    static EMPTY: AnnotationSet = {
        s_id: 0,
        name: "",
        description: ""
    };

    s_id: number;
    name: string;
    description: string;
}