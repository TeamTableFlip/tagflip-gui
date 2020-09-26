import React, {FunctionComponent, useEffect} from "react";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {RouteComponentProps, withRouter} from "react-router-dom";
import NewAnnotationTask from "./new/NewAnnotationTask";
import EditAnnotationTask from "./edit/EditAnnotationTask";
import Corpus from "../../../../backend/model/Corpus";
import AnnotationTask from "../../../../backend/model/AnnotationTask";


const connector = connect((state: RootState) => ({
    annotationTask: state.activeAnnotationTask,
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps & {
    new?: boolean
};

/**
 * The view for creating and updating single AnnotationSets with their list of Annotations.
 */
const FormAnnotationTask: FunctionComponent<Props> = (props) => {


    useEffect(() => {
        if (props.new) {
            props.setActiveAnnotationTask(AnnotationTask.create());
        }
    }, [])


    const isNewAnnotationTask = () => {
        return props.annotationTask.values.annotationTaskId <= 0
    }

    return (
        <div className="w-75 d-block justify-content-center">
            {isNewAnnotationTask() ? <NewAnnotationTask/> : <EditAnnotationTask/>}
        </div>
    )
}

export default withRouter(connector(FormAnnotationTask));
