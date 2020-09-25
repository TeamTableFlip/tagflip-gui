import React, {FunctionComponent} from "react";
import AnnotationTaskBoard from "./board/AnnotationTaskBoard";

interface Props {

}

export const AnnotationTaskOverview: FunctionComponent<Props> = (props) => {


    return (
        <div className="w-75 h-100">
            <h4 className="mb-5">Annotation Tasks</h4>
            <AnnotationTaskBoard/>
        </div>
    )
}
